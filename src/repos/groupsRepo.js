// src/repos/groupsRepo.js
import {
    collection, doc, addDoc, getDocs, getDoc,
    query, where, orderBy, limit, onSnapshot,
    runTransaction, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { participantsKey as makeKey } from '../utils/ids';

/** Collection refs */
const CONVOS = collection(db, 'conversations');
const MESSAGES = collection(db, 'messages'); // <-- top-level messages (matches reader)

/**
 * Live list of groups the current user belongs to, newest first.
 * onNext receives an array of { id, ...data } documents.
 */
export const subscribeUserGroupsOrdered = (currentUid, onNext, onError) => {
    const q = query(
        CONVOS,
        where('type', '==', 'group'),
        where('participants', 'array-contains', currentUid),
        orderBy('lastActivity', 'desc')
    );
    return onSnapshot(
        q,
        (snap) => {
            const out = [];
            snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
            onNext?.(out);
        },
        onError
    );
};

/**
 * Find a group with EXACTLY this participant set.
 * Uses participantsKey for O(1) equality match.
 * Returns { id, ...data } or null.
 */
export const findGroupByParticipantsKey = async (pKey) => {
    const q = query(
        CONVOS,
        where('type', '==', 'group'),
        where('participantsKey', '==', pKey),
        limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
};

/**
 * Create a new group conversation shell.
 * Initializes unread/read maps for all participants.
 */
export const createGroupConversation = async ({ title, participants, createdBy }) => {
    const uniq = [...new Set(participants)];
    if (uniq.length < 3) throw new Error('Group must have at least 3 participants.');
    const key = makeKey(uniq);

    const unreadMap = {};
    const readMap = {};
    uniq.forEach((uid) => {
        unreadMap[uid] = 0;
        readMap[uid] = null;
    });

    const payload = {
        type: 'group',
        title: title || null,
        participants: uniq,
        participantsKey: key,
        createdBy,
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
        lastMessage: null,
        lastReadBy: readMap,
        unreadCount: unreadMap,
    };

    const ref = await addDoc(CONVOS, payload);
    const docSnap = await getDoc(ref);
    return { id: ref.id, ...docSnap.data() };
};

/**
 * Mark a conversation read for a user (group-safe).
 * Sets lastReadBy[userId] = now, unreadCount[userId] = 0
 */
export const markGroupConversationReadForUser = async (conversationId, userId) => {
    const ref = doc(db, 'conversations', conversationId);
    await updateDoc(ref, {
        [`lastReadBy.${userId}`]: serverTimestamp(),
        [`unreadCount.${userId}`]: 0,
    });
};

/**
 * Append a message to a group and bump unread for all except sender.
 * Writes to the TOP-LEVEL `messages` collection so the existing reader sees it.
 * messagePayload must include: conversationId, senderId, senderName, text, type.
 * We ensure `conversationId` and `timestamp` are set in the stored message.
 */
export const appendGroupMessageAndBumpUnreadTxn = async (conversationId, messagePayload, senderId) => {
    const convoRef = doc(db, 'conversations', conversationId);

    await runTransaction(db, async (tx) => {
        // 1) read conversation
        const convoSnap = await tx.get(convoRef);
        if (!convoSnap.exists()) throw new Error('Conversation not found');

        const convo = convoSnap.data();
        const participants = Array.isArray(convo.participants) ? convo.participants : [];
        if (!participants.includes(senderId)) throw new Error('Sender not in conversation');

        // 2) create a top-level message doc (auto id) with expected fields
        const msgRef = doc(MESSAGES);
        const msg = {
            ...messagePayload,
            conversationId,           // make sure it's present and correct
            timestamp: serverTimestamp(), // reader orders by 'timestamp'
        };
        tx.set(msgRef, msg);

        // 3) bump unread for everyone except the sender
        const nextUnread = { ...(convo.unreadCount || {}) };
        participants.forEach((uid) => {
            if (uid === senderId) return;
            nextUnread[uid] = (nextUnread[uid] || 0) + 1;
        });

        // 4) update conversation summary
        tx.update(convoRef, {
            lastActivity: serverTimestamp(),
            lastMessage: {
                text: msg.text,
                senderId: senderId,
                timestamp: serverTimestamp(),
            },
            unreadCount: nextUnread,
        });
    });
};
