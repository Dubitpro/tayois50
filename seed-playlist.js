import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function seed() {
  const tracks = [
    {
      title: 'Dansaki',
      artist: 'Lara George',
      coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=200',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      order: 1,
      active: true
    },
    {
      title: 'Ore Òfé Shá',
      artist: 'Rotimikeys',
      coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=200',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      order: 2,
      active: true
    },
    {
      title: 'Gratitude',
      artist: 'Brandon Lake',
      coverImage: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80&w=200',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      order: 3,
      active: true
    },
    {
      title: "Kos'oba Bi Re",
      artist: 'Psalmos Ft. Tope Alabi',
      coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=200',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      order: 4,
      active: true
    },
    {
      title: 'All',
      artist: 'Chandler Moore',
      coverImage: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?auto=format&fit=crop&q=80&w=200',
      audioUrl: '/all-chandler-moore.mp3',
      order: 5,
      active: true
    }
  ];

  for (const track of tracks) {
    await addDoc(collection(db, 'playlist'), track);
  }
  console.log('Seeded playlist');
}
seed();
