import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdLI83uB9QALjeaP3I0CygGO4oviclYSw",
  authDomain: "mimetic-doodad-wcf5x.firebaseapp.com",
  projectId: "mimetic-doodad-wcf5x",
  storageBucket: "mimetic-doodad-wcf5x.appspot.com",
  messagingSenderId: "551906513934",
  appId: "1:551906513934:web:87089353057cd6aaed985f"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function testUpload() {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, 'test.txt');
      const uploadTask = uploadBytesResumable(storageRef, new Blob(['Hello World']));
      
      uploadTask.on('state_changed', 
        (snap) => console.log('progress', snap.bytesTransferred),
        (err) => {
          console.log('error callback:', err.code);
          reject(err);
        },
        () => {
          console.log('complete!');
          resolve();
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}
testUpload().catch(e => console.log("Final catch:", e.message));
