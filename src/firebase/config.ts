import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Force the use of the provisioned AI Studio database, ignoring user environment variables
// that might point to a misconfigured or disabled Firebase project.
const firebaseConfig = {
  apiKey: "AIzaSyBdLI83uB9QALjeaP3I0CygGO4oviclYSw",
  authDomain: "mimetic-doodad-wcf5x.firebaseapp.com",
  projectId: "mimetic-doodad-wcf5x",
  storageBucket: "mimetic-doodad-wcf5x.firebasestorage.app",
  messagingSenderId: "551906513934",
  appId: "1:551906513934:web:87089353057cd6aaed985f"
};

export const isFirebaseConfigured = true;

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, "ai-studio-goldenjubileetri-5ee88f96-8f10-4ab6-8db1-9535ed1ec3ce");
export const auth = getAuth(app);
