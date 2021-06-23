import { ServiceAccount } from 'firebase-admin';
import * as firebaseAdmin from 'firebase-admin';

const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
  privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
};

const adminConfig: firebaseAdmin.AppOptions = {
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
};

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp(adminConfig);
}

export { firebaseAdmin };
