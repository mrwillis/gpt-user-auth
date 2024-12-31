import * as aws from "@pulumi/aws";
import { sendVerificationCodeHandler, verifyCodeHandler } from '../../handlers/auth';
import { lambdaRole } from "../resources/shared";
import { createLambdaConfig } from "../resources/lambda-config";

// Send Verification Code Lambda
export const sendVerificationCodeLambda = new aws.lambda.CallbackFunction("sendVerificationCode", {
    ...createLambdaConfig(lambdaRole.arn),
    callback: sendVerificationCodeHandler
});

// Send Verification Code Log Group
new aws.cloudwatch.LogGroup("sendVerificationCodeLogGroup", {
    name: sendVerificationCodeLambda.name.apply(name => `/aws/lambda/${name}`),
    retentionInDays: 14,
});

// Verify Code Lambda
export const verifyCodeLambda = new aws.lambda.CallbackFunction("verifyCode", {
    ...createLambdaConfig(lambdaRole.arn),
    callback: verifyCodeHandler
});

// Verify Code Log Group
new aws.cloudwatch.LogGroup("verifyCodeLogGroup", {
    name: verifyCodeLambda.name.apply(name => `/aws/lambda/${name}`),
    retentionInDays: 14,
});