import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { commonHeaders } from '../pulumi/resources/lambda-config';
import { storeVerificationCode, verifyCode, deleteVerificationCode } from '../services/users';
import { getAuth } from "../services/firebase";
import {createEmailService} from '../services/email';
import { createLongLivedToken } from '../services/jwt';

function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendVerificationCodeHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
        const { email } = JSON.parse(event.body || '{}');
        
        if (!email) {
            return {
                statusCode: 400,
                headers: commonHeaders,
                body: JSON.stringify({ error: "Email is required" })
            };
        }

        const code = generateVerificationCode();
        await storeVerificationCode(email, code);

        // Dynamically import the email service
        const emailService = createEmailService();

        await emailService.sendVerificationEmail(email, code);

        return {
            statusCode: 200,
            headers: commonHeaders,
            body: JSON.stringify({ 
                message: "Verification code sent successfully",
                email 
            })
        };
    } catch (error) {
        console.error('Error sending verification code:', error);
        return {
            statusCode: 500,
            headers: commonHeaders,
            body: JSON.stringify({ error: "Failed to send verification code" })
        };
    }
};

export async function verifyCodeHandler(event: APIGatewayProxyEvent) {
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
        const { email, code } = JSON.parse(event.body || '{}');

        if (!email || !code) {
            return {
                statusCode: 400,
                headers: commonHeaders,
                body: JSON.stringify({ error: "Email and code are required" })
            };
        }

        const verificationResult = await verifyCode(email, code);
        if (!verificationResult) {
            return {
                statusCode: 400,
                headers: commonHeaders,
                body: JSON.stringify({ error: "Invalid or expired code" })
            };
        }

        // Create or get Firebase user
        const auth = await getAuth();
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch {
            userRecord = await auth.createUser({ email });
        }

        // Create custom token
        const token = await createLongLivedToken(userRecord.uid, userRecord.email || '');
        
        // Clean up used code
        await deleteVerificationCode(email);

        return {
            statusCode: 200,
            headers: commonHeaders,
            body: JSON.stringify({ 
                token,
                userId: userRecord.uid,
                message: "Verification successful"
            })
        };
    } catch (error) {
        console.error('Error verifying code:', error);
        return {
            statusCode: 500,
            headers: commonHeaders,
            body: JSON.stringify({ error: "Verification failed" })
        };
    }
} 