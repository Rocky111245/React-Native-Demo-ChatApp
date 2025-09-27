/**
 * Firestore CRUD for conversations collection.
 * Only getters/setters; no model construction here.
 */
import { db } from '../services/firebaseConfig';
import {
  collection, doc, getDoc, setDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, increment, runTransaction
} from 'firebase/firestore';
import { conversationIdForUsers } from '../utils/ids';

const convosColl = () => collection(db, 'conversations');

/**
 * Get a conversation by deterministic participants (1:1).
 * Returns a plain object conversation or null if missing.
 */
export const getConversationByParticipants = async (uidA, uidB) => {
  const id = conversationIdForUsers(uidA, uidB);
  const snap = await getDoc(doc(db, 'conversations', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

/**
 * Create a direct conversation document for two users.
 * Id is deterministic; if it exists this will overwrite only provided fields.
 */
export const createDirectConversationIfMissing = async (uidA, uidB) => {
  const id = conversationIdForUsers(uidA, uidB);
  const ref = doc(db, 'conversations', id);
  await setDoc(ref, {
    participants: [uidA, uidB],
    type: 'direct',
    createdAt: serverTimestamp(),
    lastActivity: serverTimestamp(),
    lastMessage: null,
    lastReadBy: { [uidA]: serverTimestamp(), [uidB]: serverTimestamp() },
    unreadCount: { [uidA]: 0, [uidB]: 0 }
  }, { merge: true });
  const snap = await getDoc(ref);
  return { id, ...snap.data() };
};

/**
 * Get an existing direct conversation or create it if missing.
 */
export const getExistingDirectConversationOrCreateNew = async (uidA, uidB) => {
  const existing = await getConversationByParticipants(uidA, uidB);
  if (existing) return existing;
  return createDirectConversationIfMissing(uidA, uidB);
};

/**
 * Mark conversation as read for a user.
 * - Sets lastReadBy[user]=now
 * - Resets unreadCount[user]=0
 */
export const markConversationReadForUser = async (conversationId, uid) => {
  await setDoc(doc(db, 'conversations', conversationId), {
    lastReadBy: { [uid]: serverTimestamp() },
    unreadCount: { [uid]: 0 }
  }, { merge: true });
};

/**
 * Subscribe to all conversations for a user, newest first.
 * callback receives an array of plain objects; returns unsubscribe fn.
 * Requires composite index (participants array-contains + lastActivity desc). Indexing has been done in fireStore console.
 */
export const subscribeUserConversationsOrdered = (uid, callback, onError) => {
  const q = query(
    convosColl(),
    where('participants', 'array-contains', uid),
    orderBy('lastActivity', 'desc')
  );
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      unreadCount: d.data()?.unreadCount?.[uid] || 0
    }));
    callback(items);
  }, onError);
};

/**
 * Atomically: create message and bump recipient's unread, update lastMessage/lastActivity.
 * - messageRef: doc ref in 'messages'
 * - conversationId: id in 'conversations'
 * - messagePayload: plain object { conversationId, senderId, senderName, text, timestamp, type }
 * - recipientUid: other user's uid (to increment unread)
 */
export const appendMessageAndBumpUnreadTxn = async (messageRef, conversationId, messagePayload, recipientUid) => {
  const convoRef = doc(db, 'conversations', conversationId);
  await runTransaction(db, async (tx) => {
    const convoSnap = await tx.get(convoRef);
    if (!convoSnap.exists()) throw new Error('Conversation not found');

    tx.set(messageRef, messagePayload);
    tx.update(convoRef, {
      lastMessage: { text: messagePayload.text, senderId: messagePayload.senderId, timestamp: serverTimestamp() },
      lastActivity: serverTimestamp(),
      ...(recipientUid ? { [`unreadCount.${recipientUid}`]: increment(1) } : {})
    });
  });
};
