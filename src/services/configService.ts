import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface FrontendConfigData {
  countdownDate: string;
  heroTitleTop: string;
  heroTitleMain: string;
  heroCaptions: string[];
  galleryImages: string[];
}

const DEFAULT_CONFIG: FrontendConfigData = {
  countdownDate: "2024-11-20T00:00:00",
  heroTitleTop: "Golden Jubilee",
  heroTitleMain: "Tayo is 50",
  heroCaptions: [
    "A Celebration of Grace",
    "Half a Century of Elegance",
    "A Legacy of Love"
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  ]
};

export const getConfig = async (): Promise<FrontendConfigData> => {
  const docRef = doc(db, 'settings', 'frontendConfig');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as FrontendConfigData;
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = async (config: FrontendConfigData): Promise<void> => {
  const docRef = doc(db, 'settings', 'frontendConfig');
  await setDoc(docRef, config);
};

export const subscribeToConfig = (callback: (config: FrontendConfigData) => void) => {
  const docRef = doc(db, 'settings', 'frontendConfig');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as FrontendConfigData);
    } else {
      callback(DEFAULT_CONFIG);
    }
  });
};
