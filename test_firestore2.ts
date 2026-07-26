import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp({
  apiKey: config.apiKey,
  projectId: config.projectId,
});
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const snap = await getDocs(collection(db, "messages"));
    console.log("Docs found:", snap.size);
  } catch (e) {
    console.error("Read Error:", e.message);
  }
  process.exit(0);
}
run();
