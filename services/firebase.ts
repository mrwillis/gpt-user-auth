import * as admin from 'firebase-admin';
import { getFirebaseCredentials } from './ssm';

// Initialize Firebase Admin with your service account
let auth: admin.auth.Auth;

async function initializeFirebaseAdmin() {

    if (!admin.apps.length) {
    const firebaseCredentials = await getFirebaseCredentials();

        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(firebaseCredentials)),
        });
    }
}

export const getAuth = async () => {
    if (!auth) {
        await initializeFirebaseAdmin();
        auth = admin.auth();
    }
    return auth;
}
