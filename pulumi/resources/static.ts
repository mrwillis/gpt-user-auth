import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { api } from './shared';
import { privacyPolicyLambda } from '../lambdas/static';

// Create privacy-policy resource
const privacyPolicyResource = new aws.apigateway.Resource("privacyPolicyResource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "privacy-policy",
});

// Create GET method
const getMethod = new aws.apigateway.Method("getPrivacyPolicyMethod", {
    restApi: api.id,
    resourceId: privacyPolicyResource.id,
    httpMethod: "GET",
    authorization: "NONE",
});

// Add Lambda permission
new aws.lambda.Permission("privacyPolicyPermission", {
    action: "lambda:InvokeFunction",
    function: privacyPolicyLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/${getMethod.httpMethod}${privacyPolicyResource.path}`,
});

// Create integration
export const privacyPolicyIntegration = new aws.apigateway.Integration("privacyPolicyIntegration", {
    restApi: api.id,
    resourceId: privacyPolicyResource.id,
    httpMethod: getMethod.httpMethod,
    integrationHttpMethod: "POST",
    type: "AWS_PROXY",
    uri: privacyPolicyLambda.invokeArn,
}); 