import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import fs from 'fs';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  try {
    const docRef = await addDoc(collection(db, 'guestbook_messages'), {
      fullName: 'Test Automation',
      message: 'This is a test message from automation script with 10 chars.',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      approved: true,
      likes: 0,
      avatarColor: '#D4AF37'
    });
    console.log("Success write! docId:", docRef.id);
    const snap = await getDocs(collection(db, 'guestbook_messages'));
    console.log("Read count:", snap.size);
    process.exit(0);
  } catch(e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
run();
