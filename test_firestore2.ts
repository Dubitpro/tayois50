import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const docRef = await addDoc(collection(db, 'wishes'), {
      name: 'Test',
      country: 'Test Country',
      message: 'This is a test message with 10 chars.',
      createdAt: serverTimestamp(),
      likes: 0
    });
    console.log("Success! docId:", docRef.id); process.exit(0);
  } catch(e) {
    console.error("Error:", e); process.exit(1);
  }
}
run();
