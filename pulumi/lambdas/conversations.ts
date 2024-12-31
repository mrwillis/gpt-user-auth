import * as aws from "@pulumi/aws";
import { lambdaRole } from "../resources/shared";
import { createLambdaConfig } from "../resources/lambda-config";
import { listConversationsHandler, addConversationHandler } from '../../handlers/conversations';

// Get Conversations Lambda
export const listConversationsLambda = new aws.lambda.CallbackFunction("listConversations", {
    ...createLambdaConfig(lambdaRole.arn),
    callback: listConversationsHandler
});

// Get Conversations Log Group
new aws.cloudwatch.LogGroup("listConversationsLogGroup", {
    name: listConversationsLambda.name.apply(name => `/aws/lambda/${name}`),
    retentionInDays: 14,
});

// Add Conversation Lambda
export const addConversationLambda = new aws.lambda.CallbackFunction("addConversation", {
    ...createLambdaConfig(lambdaRole.arn),
    callback: addConversationHandler
});

// Add Conversation Log Group
new aws.cloudwatch.LogGroup("addConversationLogGroup", {
    name: addConversationLambda.name.apply(name => `/aws/lambda/${name}`),
    retentionInDays: 14,
});

