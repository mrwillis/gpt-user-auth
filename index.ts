import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { api } from './pulumi/resources/shared';
import { listConversationIntegration, addConversationIntegration } from './pulumi/resources/conversations';
import { sendLinkIntegration, verifyEmailIntegration } from './pulumi/resources/auth';
import { privacyPolicyIntegration } from './pulumi/resources/static';

const stack = pulumi.getStack();

// Create deployment
const deployment = new aws.apigateway.Deployment("apiDeployment", {
    restApi: api.id,
    stageName: stack,
}, { dependsOn: [
    listConversationIntegration,
    addConversationIntegration,
    sendLinkIntegration,
    verifyEmailIntegration,
    privacyPolicyIntegration
]});

// Export the URLs
export const apiUrl = deployment.invokeUrl;