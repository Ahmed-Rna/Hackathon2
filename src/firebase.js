import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Firebase Authentication
import { getFirestore } from 'firebase/firestore';  // Firestore for database

const firebaseConfig = {
  apiKey: "AIzaSyAh9FvirKFhMVe178nUqAdedqodVwKssIQ",
  authDomain: "hackathon-55cf5.firebaseapp.com",
  projectId: "hackathon-55cf5",
  storageBucket: "hackathon-55cf5.appspot.com",
  messagingSenderId: "546868124260",
  appId: "1:546868124260:web:4b3d61f8604ebd5ccf1d71",
  measurementId: "G-FV15PJM3G5"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);  // Firebase authentication service
const db = getFirestore(app);  // Firestore database service

// Export auth and db so they can be used in other files
export { auth, db };