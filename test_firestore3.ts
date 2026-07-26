import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp({
  apiKey: config.apiKey,
  projectId: config.projectId,
});
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    console.log("Adding doc...");
    const p = addDoc(collection(db, "messages"), {
      fullName: "Test User",
      country: "Test Country",
      message: "This is a test message.",
      createdAtUnix: Date.now(),
      status: 'approved',
      anonymousId: "test-uid",
      isPinned: false,
    });
    
    await Promise.race([
      p,
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
    ]);
    console.log("Success");
  } catch (e) {
    console.error("Write Error:", e.message);
  }
  process.exit(0);
}
run();
