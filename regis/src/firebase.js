import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBP0HVAe_PZV8fEVd4noAUAoVJJdLpux54',
  authDomain: 'regis-357d2.firebaseapp.com',
  projectId: 'regis-357d2',
  storageBucket: 'regis-357d2.appspot.com',
  messagingSenderId: '454922525995',
  appId: '1:454922525995:web:74d4e987248e5e16bfb96e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Database names
const testSuffix = '-test';

export const QUESTIONS_COLLECTION = `questions${testSuffix}`,
  ROUNDS_COLLECTION = `rounds${testSuffix}`,
  TOPICS_COLLECTION = `topics${testSuffix}`,
  TEAMS_COLLECTION = `teams${testSuffix}`,
  CONTEXT = 'context';

export { db };
