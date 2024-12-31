import * as jwt from 'jsonwebtoken';
import { getJwtSecretParameterStore } from './ssm';

let JWT_SECRET: string | null = null;

export async function getJwtSecret() {
    if (!JWT_SECRET) {
        JWT_SECRET = await getJwtSecretParameterStore();
    }
    return JWT_SECRET;
}

export async function createLongLivedToken(uid: string, email: string) {
    const secret = await getJwtSecret();
    return jwt.sign(
        { uid, email },
        secret,
        { expiresIn: '1 day' } // 1 day
    );
}

export async function verifyLongLivedToken(token: string) {
    const secret = await getJwtSecret();
    return jwt.verify(token, secret) as jwt.JwtPayload;
} 