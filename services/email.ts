import { SES, SendEmailCommand } from '@aws-sdk/client-ses';

export const createEmailService = () => {
    const ses = new SES({});

    const sendVerificationEmail = async (email: string, code: string) => {
        const params = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: {
                        Data: `Your verification code is: ${code}\n\nThis code will expire in 15 minutes.`,
                    },
                },
                Subject: {
                    Data: "Your Verification Code",
                },
            },
            Source: process.env.FROM_EMAIL!, // You'll need to verify this email in SES
        };

        try {
            await ses.send(new SendEmailCommand(params));
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    };

    return {
        sendVerificationEmail
    };
}; 