import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdLI83uB9QALjeaP3I0CygGO4oviclYSw",
  authDomain: "mimetic-doodad-wcf5x.firebaseapp.com",
  projectId: "mimetic-doodad-wcf5x",
  storageBucket: "mimetic-doodad-wcf5x.firebasestorage.app",
  messagingSenderId: "551906513934",
  appId: "1:551906513934:web:87089353057cd6aaed985f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  try {
    const storageRef = ref(storage, 'test.txt');
    await uploadString(storageRef, 'Hello World');
    const url = await getDownloadURL(storageRef);
    console.log("Upload successful! URL:", url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
testUpload();
