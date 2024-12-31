import { getDb } from './db';

export async function storeVerificationCode(email: string, code: string) {
    try {
        // Delete any existing codes for this email
        const db = await getDb();
        await db`
            DELETE FROM verification_codes 
            WHERE email = ${email}
        `;
        // Store new code
        await db`
            INSERT INTO verification_codes (email, code, expires_at) 
            VALUES (${email}, ${code}, NOW() + INTERVAL '15 minutes')
        `;
    } catch (error) {
        console.error('Error in storeVerificationCode:', error);
        throw error;
    }
}

export async function verifyCode(email: string, code: string) {
    try {
        const db = await getDb();
        const [result] = await db`
            SELECT * FROM verification_codes 
            WHERE email = ${email} 
            AND code = ${code} 
            AND expires_at > NOW()
        `;
        return result;
    } catch (error) {
        console.error('Error in verifyCode:', error);
        throw error;
    }
}

export async function deleteVerificationCode(email: string) {
    try {
        const db =  await getDb();
        await db`
            DELETE FROM verification_codes 
            WHERE email = ${email}
        `;
    } catch (error) {
        console.error('Error in deleteVerificationCode:', error);
        throw error;
    }
} 