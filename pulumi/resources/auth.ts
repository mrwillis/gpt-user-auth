import * as aws from "@pulumi/aws";
import { api } from './shared';
import { sendVerificationCodeLambda, verifyCodeLambda } from '../lambdas/auth';
import * as pulumi from "@pulumi/pulumi";

// Create auth base resource
const authResource = new aws.apigateway.Resource("authResource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "auth",
});

// Create send-link resource and method
const sendLinkResource = new aws.apigateway.Resource("sendLinkResource", {
    restApi: api.id,
    parentId: authResource.id,
    pathPart: "send-link",
});

const sendLinkMethod = new aws.apigateway.Method("sendLinkMethod", {
    restApi: api.id,
    resourceId: sendLinkResource.id,
    httpMethod: "POST",
    authorization: "NONE",
});

// Create verify-email resource and method
const verifyEmailResource = new aws.apigateway.Resource("verifyEmailResource", {
    restApi: api.id,
    parentId: authResource.id,
    pathPart: "verify-email",
});

const verifyEmailMethod = new aws.apigateway.Method("verifyEmailMethod", {
    restApi: api.id,
    resourceId: verifyEmailResource.id,
    httpMethod: "POST",
    authorization: "NONE",
});

// Create integrations
export const sendLinkIntegration = new aws.apigateway.Integration("sendLinkIntegration", {
    restApi: api.id,
    resourceId: sendLinkResource.id,
    httpMethod: sendLinkMethod.httpMethod,
    integrationHttpMethod: "POST",
    type: "AWS_PROXY",
    uri: sendVerificationCodeLambda.invokeArn,
});

export const verifyEmailIntegration = new aws.apigateway.Integration("verifyEmailIntegration", {
    restApi: api.id,
    resourceId: verifyEmailResource.id,
    httpMethod: verifyEmailMethod.httpMethod,
    integrationHttpMethod: "POST",
    type: "AWS_PROXY",
    uri: verifyCodeLambda.invokeArn,
});

// Add Lambda permission for send verification code
new aws.lambda.Permission("sendVerificationCodePermission", {
    action: "lambda:InvokeFunction",
    function: sendVerificationCodeLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/${sendLinkMethod.httpMethod}${sendLinkResource.path}`,
});

// Add Lambda permission for verify code
new aws.lambda.Permission("verifyCodePermission", {
    action: "lambda:InvokeFunction",
    function: verifyCodeLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/${verifyEmailMethod.httpMethod}${verifyEmailResource.path}`,
}); 