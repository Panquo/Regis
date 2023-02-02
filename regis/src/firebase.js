import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAFDB4nLANm3VWwF0WdljDRZzfczFmJXsE',
  authDomain: 'regis-c093f.firebaseapp.com',
  projectId: 'regis-c093f',
  storageBucket: 'regis-c093f.appspot.com',
  messagingSenderId: '615875781768',
  appId: '1:615875781768:web:4d1bb9861a26294f636b3d',
};
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
