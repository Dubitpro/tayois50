import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBdLI83uB9QALjeaP3I0CygGO4oviclYSw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mimetic-doodad-wcf5x.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mimetic-doodad-wcf5x",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mimetic-doodad-wcf5x.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "551906513934",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:551906513934:web:87089353057cd6aaed985f"
};

export const isFirebaseConfigured = true;

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-goldenjubileetri-5ee88f96-8f10-4ab6-8db1-9535ed1ec3ce");
export const auth = getAuth(app);
export const storage = getStorage(app);
