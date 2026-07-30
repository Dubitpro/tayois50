import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

interface AuthContextType {
  currentUser: any | null;
  loading: boolean;
  mockLogin?: () => void;
  mockLogout?: () => void;
}

const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isMockLoggedIn = localStorage.getItem('mockAdminLoggedIn') === 'true';
    if (isMockLoggedIn) {
      setCurrentUser({ email: 'admin@palace.com', uid: 'mock-admin' });
      setLoading(false);
    }

    if (!isFirebaseConfigured) {
      if (!isMockLoggedIn) {
        setCurrentUser(null);
        setLoading(false);
      }
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        if (localStorage.getItem('mockAdminLoggedIn') !== 'true') {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const mockLogin = () => {
    localStorage.setItem('mockAdminLoggedIn', 'true');
    setCurrentUser({ email: 'admin@palace.com', uid: 'mock-admin' });
  };

  const mockLogout = () => {
    localStorage.removeItem('mockAdminLoggedIn');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, mockLogin, mockLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
