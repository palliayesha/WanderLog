
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
} from 'firebase/auth';
// @ts-expect-error Firebase 13.4.0 React Native export is missing from TypeScript declarations.
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
