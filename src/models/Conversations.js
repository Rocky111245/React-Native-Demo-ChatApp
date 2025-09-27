// Schema helper for conversation data (no Firestore calls here)
import { serverTimestamp } from 'firebase/firestore';

/**
 * Conversation model (schema + helpers, no I/O)
 * Use to construct or validate conversation-shaped objects in app code.
 */
export class Conversations {
  constructor(data = {}) {
    this.id = data.id;
    this.participants = data.participants || [];   // [uidA, uidB]
    this.type = data.type || 'direct';             // 'direct' | 'group' (future)
    this.createdAt = data.createdAt || serverTimestamp();
    this.lastActivity = data.lastActivity || serverTimestamp();
    this.lastMessage = data.lastMessage || null;   // { text, senderId, timestamp }
    this.lastReadBy = data.lastReadBy || {};       // { uid: Timestamp }
    this.unreadCount = data.unreadCount || {};     // { uid: number }
  }

  // Convert to plain object for Firestore
  toFirestore() {
    const { id, ...rest } = this;
    return rest;
  }

  // Basic validation hook. This is optional.
  static validate(obj) {
    const errors = [];
    if (!Array.isArray(obj.participants) || obj.participants.length < 2) {
      errors.push('participants must be an array with at least 2 user ids');
    }
    return { isValid: errors.length === 0, errors };
  }
}

export default Conversations;
