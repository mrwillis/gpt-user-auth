import { APIGatewayProxyEvent } from 'aws-lambda';
import { getAuth } from '../services/firebase';
import { commonHeaders } from '../pulumi/resources/lambda-config';
import { verifyLongLivedToken } from '../services/jwt';

export interface AuthenticatedEvent extends APIGatewayProxyEvent {
    user: {
        uid: string;
        email: string;
    };
}

export async function verifyAuth(event: APIGatewayProxyEvent) {
    const headers = event.headers || {};
    const apiKey = headers['x-api-key'] || headers['X-Api-Key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return {
            statusCode: 401,
            headers: commonHeaders,
            body: JSON.stringify({ error: "Invalid API key" })
        };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const token = body.token;

        if (!token) {
            return {
                statusCode: 401,
                headers: commonHeaders,
                body: JSON.stringify({ error: "No token provided" })
            };
        }

        const decodedToken = await verifyLongLivedToken(token);
        
        if (!decodedToken?.uid) {
            return {
                statusCode: 401,
                headers: commonHeaders,
                body: JSON.stringify({ error: "Invalid token format" })
            };
        }

        const auth = await getAuth();
        try {
            const userRecord = await auth.getUser(decodedToken.uid);
            return {
                ...event,
                user: {
                    uid: userRecord.uid,
                    email: userRecord.email || ''
                }
            } as AuthenticatedEvent;
        } catch (error) {
            console.error('User not found:', error);
            return {
                statusCode: 401,
                headers: commonHeaders,
                body: JSON.stringify({ error: "User not found" })
            };
        }
    } catch (error) {
        console.error('Auth error:', error);
        return {
            statusCode: 401,
            headers: commonHeaders,
            body: JSON.stringify({ error: "Invalid token" })
        };
    }
}