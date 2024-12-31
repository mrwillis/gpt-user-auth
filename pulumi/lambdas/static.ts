import * as aws from "@pulumi/aws";
import { createLambdaConfig } from "../resources/lambda-config";
import { lambdaRole } from "../resources/shared";
import { privacyPolicyHandler } from "../../handlers/static";

export const privacyPolicyLambda = new aws.lambda.CallbackFunction("privacyPolicy", {
    ...createLambdaConfig(lambdaRole.arn),
    callback: privacyPolicyHandler
}); 

// Get Conversations Log Group
new aws.cloudwatch.LogGroup("privacyPolicyLogGroup", {
    name: privacyPolicyLambda.name.apply(name => `/aws/lambda/${name}`),
    retentionInDays: 14,
});