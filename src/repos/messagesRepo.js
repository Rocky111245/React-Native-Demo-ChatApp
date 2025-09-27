/**
 * Firestore CRUD for messages collection.
 * Only getters/setters/streams; no model construction here.
 */
import { db } from '../services/firebaseConfig';
import {
  collection, doc, query, where, orderBy, limit, onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

const msgsColl = () => collection(db, 'messages');

/**
 * Create a new message document ref with auto id.
 */
export const createNewMessageDocRef = () => doc(msgsColl());

/**
 * Build a plain payload for a text message (no model usage here).
 */
export const buildPlainTextMessagePayload = ({ conversationId, senderId, senderName, text }) => ({
  conversationId,
  senderId,
  senderName: senderName || 'Unknown',
  text: String(text),
  type: 'text',
  timestamp: serverTimestamp()
});

/**
 * Real-time subscribe to messages for a conversation, oldest-first.
 * callback receives an array of plain objects.
 */
export const subscribeMessagesByConversationAsc = (conversationId, callback, onError) => {
  const q = query(
    msgsColl(),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc'),
    limit(50)
  );
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  }, onError);
};
