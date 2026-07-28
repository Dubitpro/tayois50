import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const postsQuery = query(collection(db, 'wishPosts'), orderBy('createdAtUnix', 'desc'));
  const snapshot = await getDocs(postsQuery);
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
}
run();
