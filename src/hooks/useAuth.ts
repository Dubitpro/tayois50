import { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';

let sharedUser: User | null = null;
let isSigningIn = false;

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(sharedUser);
  const [loading, setLoading] = useState(!sharedUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        sharedUser = currentUser;
        setUser(currentUser);
        setLoading(false);
        setError(null);
      } else {
        if (!isSigningIn) {
          isSigningIn = true;
          try {
            const { user: anonUser } = await signInAnonymously(auth);
            sharedUser = anonUser;
            setUser(anonUser);
            setError(null);
          } catch (err: any) {
            console.error("Error signing in anonymously:", err);
            if (err.code === 'auth/admin-restricted-operation') {
              setError("Anonymous authentication is disabled. Please enable it in the Firebase Console.");
            } else {
              setError(err.message);
            }
          } finally {
            isSigningIn = false;
            setLoading(false);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, error };
};
