
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD7KEZ3OAW95DbgiW5he3EzFT_XKevIRRs",
  authDomain: "wanderlog-abb4c.firebaseapp.com",
  projectId: "wanderlog-abb4c",
  storageBucket: "wanderlog-abb4c.firebasestorage.app",
  messagingSenderId: "604505808964",
  appId: "1:604505808964:web:075d77e5f71b15192e9c11"
};

  // Replace this comment with your copied configuration fields

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
