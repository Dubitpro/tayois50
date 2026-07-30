import { useState, useEffect } from 'react';

export interface AppUser {
  uid: string;
  isAnonymous: boolean;
}

let sharedUser: AppUser | null = null;

const getOrCreateDeviceId = () => {
  const key = 'app_device_id';
  let deviceId = localStorage.getItem(key);
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem(key, deviceId);
  }
  return deviceId;
};

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(sharedUser);
  const [loading, setLoading] = useState(!sharedUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sharedUser) {
      const uid = getOrCreateDeviceId();
      sharedUser = { uid, isAnonymous: true };
      setUser(sharedUser);
      setLoading(false);
    }
  }, []);

  return { user, loading, error };
};
