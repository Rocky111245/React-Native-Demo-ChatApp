/**
 * Firestore CRUD for users collection.
 * NOTE: pure data access; no model construction or UI logic here.
 */
import { db } from '../services/firebaseConfig';
import {
  collection, doc, setDoc, getDoc, getDocs,
  query, orderBy, limit, serverTimestamp
} from 'firebase/firestore';

const usersColl = () => collection(db, 'users');

/**
 * Create or update a user profile document from Auth user info.
 */
export const upsertUserProfile = async (authUser) => {
  const ref = doc(db, 'users', authUser.uid);
  await setDoc(ref, {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName || authUser.email.split('@')[0],
    isOnline: true,
    lastSeen: serverTimestamp(),
    createdAt: serverTimestamp()
  }, { merge: true });
};

/**
 * Update online status and lastSeen for a user.
 */
export const setUserOnlineStatus = async (uid, isOnline) => {
  await setDoc(doc(db, 'users', uid), {
    isOnline,
    lastSeen: serverTimestamp()
  }, { merge: true });
};

/**
 * Get a single user doc (plain object or null).
 */
export const getUserById = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * List up to 50 users ordered by displayName (plain objects).
 */
export const listUsersOrderedByName = async () => {
  const q = query(usersColl(), orderBy('displayName'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
};
