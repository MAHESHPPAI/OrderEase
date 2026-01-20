// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCsy_mXOGNx8GayaadIuFgwtWDQMUd4sKo",
  authDomain: "restaurant-management-sy-786d7.firebaseapp.com",
  projectId: "restaurant-management-sy-786d7",
  storageBucket: "restaurant-management-sy-786d7.firebasestorage.app",
  messagingSenderId: "897629107086",
  appId: "1:897629107086:web:c481b6a31011badc216adf"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
