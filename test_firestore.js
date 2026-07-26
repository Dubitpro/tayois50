import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, config.firestoreDatabaseId);
const auth = getAuth(app);

async function run() {
  try {
    const { user } = await signInAnonymously(auth);
    console.log("Signed in as:", user.uid);
    const docRef = await addDoc(collection(db, "messages"), {
      fullName: "Test User",
      country: "Test Country",
      message: "This is a test message.",
      createdAt: serverTimestamp(),
      createdAtUnix: Date.now(),
      status: 'approved',
      likes: 0,
      heartReactions: 0,
      smileReactions: 0,
      celebrateReactions: 0,
      anonymousId: user.uid,
      isPinned: false,
      isEdited: false,
    });
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
run();
