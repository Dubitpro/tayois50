import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyDj_KtVPBmEUcbeEr2Jv6Y60_uKIQplRuY",
  projectId: "tayois50",
});
const db = getFirestore(app);

async function run() {
  try {
    console.log("Adding doc...");
    const p = addDoc(collection(db, "messages"), {
      message: "Test"
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
