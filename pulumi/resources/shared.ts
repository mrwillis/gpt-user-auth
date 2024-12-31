import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { infraStack } from "./lambda-config";

const stack = pulumi.getStack();
const config = new pulumi.Config();

const jwtSecretParameter = new aws.ssm.Parameter("jwtSecret", {
    type: "SecureString",
    name: `/gpt-user-auth/${stack}/JWT_SECRET`,
    value: config.requireSecret("jwtSecret"),
});

// Create an API Gateway REST API
export const api = new aws.apigateway.RestApi("myApi", {
    description: "API for my Lambda function",
});

// Create an IAM role for Lambda functions
export const lambdaRole = new aws.iam.Role("lambdaRole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "lambda.amazonaws.com",
            },
        }],
    }),
});

new aws.iam.RolePolicy("ses-policy", {
    role: lambdaRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            Resource: "*"
        }]
    })
});

// Attach policies to the Lambda role
new aws.iam.RolePolicyAttachment("lambdaBasicExecution", {
    role: lambdaRole.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

new aws.iam.RolePolicyAttachment("lambdaSsmAccess", {
    role: lambdaRole.name,
    policyArn: "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess",
});

// Create SSM parameter policy
const ssmParameterPolicy = new aws.iam.Policy("ssmParameterPolicy", {
    policy: pulumi.all([
        infraStack.getOutput("rdsUsernameParameterArn"),
        infraStack.getOutput("rdsPasswordParameterArn"),
        infraStack.getOutput("firebaseCredentialsParameterArn"),
        jwtSecretParameter.arn,
    ]).apply(([usernameArn, passwordArn, firebaseCredentialsArn, jwtSecretArn]): aws.iam.PolicyDocument => ({
        Version: "2012-10-17" as const,
        Statement: [{
            Effect: "Allow",
            Action: [
                "ssm:GetParameter",
                "ssm:GetParameters",
                "kms:Decrypt"
            ],
            Resource: [
                usernameArn,
                passwordArn,
                firebaseCredentialsArn,
                jwtSecretArn
            ]
        }]
    }))
});

new aws.iam.RolePolicyAttachment("lambdaSsmParameterAccess", {
    role: lambdaRole.name,
    policyArn: ssmParameterPolicy.arn
});

// CloudWatch Logs policy
new aws.iam.RolePolicy("cloudwatch-logs-policy", {
    role: lambdaRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            Resource: "arn:aws:logs:*:*:*"
        }]
    })
});