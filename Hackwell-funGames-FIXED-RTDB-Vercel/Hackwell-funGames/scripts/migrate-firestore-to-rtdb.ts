import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  databaseURL:
    process.env.VITE_FIREBASE_DATABASE_URL ||
    'https://hackwell-fungames-default-rtdb.asia-southeast1.firebasedatabase.app'
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const rtdb = getDatabase(app, firebaseConfig.databaseURL);

const collections = ['users', 'sessions', 'gameResults', 'xpHistory', 'auditLogs', 'adminResetTokens'];

for (const name of collections) {
  const snap = await getDocs(collection(firestore, name));
  const data: Record<string, unknown> = {};
  snap.forEach((docSnap) => {
    data[docSnap.id] = docSnap.data();
  });
  await set(ref(rtdb, name), data);
  console.log(`Migrated ${snap.size} ${name} records`);
}

console.log('Firestore → Realtime Database migration completed.');
