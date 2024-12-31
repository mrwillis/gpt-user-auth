import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { api } from './shared';
import { listConversationsLambda, addConversationLambda } from '../lambdas/conversations';

// Create conversations resource
const resource = new aws.apigateway.Resource("conversationsResource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "conversations",
});

// Create POST method
const postMethod = new aws.apigateway.Method("postConversationMethod", {
    restApi: api.id,
    resourceId: resource.id,
    httpMethod: "POST",
    authorization: "NONE",
});

// Add Lambda permission for POST
new aws.lambda.Permission("addConversationPermission", {
    action: "lambda:InvokeFunction",
    function: addConversationLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/${postMethod.httpMethod}${resource.path}`,
});

// Create conversations/list resource
const listResource = new aws.apigateway.Resource("conversationsListResource", {
    restApi: api.id,
    parentId: resource.id,
    pathPart: "list",
});

// Create POST method for listing conversations
const listMethod = new aws.apigateway.Method("listConversationsMethod", {
    restApi: api.id,
    resourceId: listResource.id,
    httpMethod: "POST",
    authorization: "NONE",
});

// Add Lambda permission for list
new aws.lambda.Permission("listConversationsPermission", {
    action: "lambda:InvokeFunction",
    function: listConversationsLambda.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/${listMethod.httpMethod}${listResource.path}`,
});

// Create integrations
export const addConversationIntegration = new aws.apigateway.Integration("addConversationIntegration", {
    restApi: api.id,
    resourceId: resource.id,
    httpMethod: postMethod.httpMethod,
    integrationHttpMethod: "POST",
    type: "AWS_PROXY",
    uri: addConversationLambda.invokeArn,
});

// Create integration for list
export const listConversationIntegration = new aws.apigateway.Integration("listConversationIntegration", {
    restApi: api.id,
    resourceId: listResource.id,
    httpMethod: listMethod.httpMethod,
    integrationHttpMethod: "POST",
    type: "AWS_PROXY",
    uri: listConversationsLambda.invokeArn,
});
