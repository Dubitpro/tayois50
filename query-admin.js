import admin from 'firebase-admin';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json'));
admin.initializeApp({
  projectId: config.projectId,
});

const db = admin.firestore();
if (config.firestoreDatabaseId) {
  db.settings({ databaseId: config.firestoreDatabaseId });
}

async function run() {
  const snapshot = await db.collection('playlist').get();
  console.log(snapshot.docs.map(d => d.data()));
}
run();
