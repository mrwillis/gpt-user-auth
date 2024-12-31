import { APIGatewayProxyEvent } from 'aws-lambda';
import { getConversations, addConversation } from '../services/conversations';
import { commonHeaders } from '../pulumi/resources/lambda-config';
import { AuthenticatedEvent, verifyAuth } from './auth-middleware';

export async function listConversationsHandler(event: APIGatewayProxyEvent) {
    const authResult = await verifyAuth(event);
    if ('statusCode' in authResult) {
        return authResult;
    }
    const authenticatedEvent = authResult as AuthenticatedEvent;
    try {
        const conversations = await getConversations(authenticatedEvent.user.uid);
        return {
            statusCode: 200,
            headers: commonHeaders,
            body: JSON.stringify(conversations)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: commonHeaders,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
}

export async function addConversationHandler(event: APIGatewayProxyEvent) {
    const authResult = await verifyAuth(event);
    if ('statusCode' in authResult) {
        return authResult;
    }
    const authenticatedEvent = authResult as AuthenticatedEvent;
    try {
        const body = JSON.parse(event.body || '{}');
        const { token, ...content } = body;
        
        const conversation = await addConversation(authenticatedEvent.user.uid, content);
        return {
            statusCode: 201,
            headers: commonHeaders,
            body: JSON.stringify(conversation)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: commonHeaders,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
}