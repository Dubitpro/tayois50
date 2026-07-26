import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBdLI83uB9QALjeaP3I0CygGO4oviclYSw",
  authDomain: "mimetic-doodad-wcf5x.firebaseapp.com",
  projectId: "mimetic-doodad-wcf5x",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-goldenjubileetri-5ee88f96-8f10-4ab6-8db1-9535ed1ec3ce");

async function run() {
  try {
    const { user } = await signInAnonymously(auth);
    console.log("Signed in as:", user.uid);
    
    console.log("Adding doc...");
    const p = addDoc(collection(db, "messages"), {
      fullName: "Test User",
      country: "Test Country",
      message: "This is a test message.",
      createdAtUnix: Date.now(),
      status: 'approved',
      anonymousId: user.uid,
      isPinned: false,
    });
    
    await Promise.race([
      p,
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 5000))
    ]);
    console.log("Success!");
  } catch (e) {
    console.error("Error:", e.message);
  }
  process.exit(0);
}
run();
