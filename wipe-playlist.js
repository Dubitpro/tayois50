import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function wipe() {
  const snapshot = await getDocs(collection(db, 'playlist'));
  for (const doc of snapshot.docs) {
    await deleteDoc(doc.ref);
  }
  console.log('Wiped playlist');
}
wipe();
