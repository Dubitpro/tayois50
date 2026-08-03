import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ai-studio-goldenjubileetri-5ee88f96-8f10-4ab6-8db1-9535ed1ec3ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = collection(db, 'gallery');
  const querySnapshot = await getDocs(q);
  console.log("Gallery images count:", querySnapshot.size);
  process.exit(0);
}
check();
