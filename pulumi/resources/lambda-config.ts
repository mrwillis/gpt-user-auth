import * as pulumi from "@pulumi/pulumi";
import {lambda} from "@pulumi/aws"

// Common configuration values
export const PARAMETERS_SECRETS_LAYER = "arn:aws:lambda:us-east-1:177933569100:layer:AWS-Parameters-and-Secrets-Lambda-Extension:12";

// Get the infrastructure stack outputs
const stack = pulumi.getStack();
const config = new pulumi.Config();
export const infraStack = new pulumi.StackReference(`your-pulumi-username-or-organization-name/gpt-user-auth-infra/${stack}`);
export const dbEndpoint = infraStack.getOutput("rdsEndpoint");
export const dbName = infraStack.getOutput("rdsDbName");
export const fromEmail = config.require("fromEmail");
const apiKey = config.requireSecret("apiKey");

// Common response headers
export const commonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

export function createLambdaConfig(roleArn: pulumi.Output<string>) {
    return {
        runtime: lambda.Runtime.NodeJS18dX,
        role: roleArn,
        layers: [PARAMETERS_SECRETS_LAYER],
        logRetention: 14,
        environment: {
            variables: pulumi.all([dbEndpoint, apiKey]).apply(([endpoint, key]) => {
                return {
                PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: "2773",
                PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: "true",
                DB_ENDPOINT: endpoint,  
                DB_NAME: dbName,
                FROM_EMAIL: fromEmail,
                PULUMI_STACK: stack,
                NODE_OPTIONS: "--enable-source-maps",
                API_KEY: key
                }
            })
        },
        codePathOptions: {
            extraIncludePaths: [
                "us-east-1-bundle.pem"
            ]
        }
    };  
} 