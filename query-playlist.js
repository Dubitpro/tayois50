import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function queryPlaylist() {
  const snapshot = await getDocs(collection(db, 'playlist'));
  const data = snapshot.docs.map(doc => doc.data());
  console.log(JSON.stringify(data, null, 2));
}
queryPlaylist();
