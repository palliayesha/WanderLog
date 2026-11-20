
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';

import {
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';

import { auth, db } from './firebase';

export async function signUp(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    createdAt: serverTimestamp(),
  });

  return userCredential;
}

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}
