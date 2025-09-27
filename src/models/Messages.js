// Schema helper for message data (no Firestore calls here)
import { serverTimestamp } from 'firebase/firestore';

/**
 * Message model (schema + helpers, no I/O)
 */
export class Messages {
  constructor(data = {}) {
    this.id = data.id;
    this.conversationId = data.conversationId;
    this.senderId = data.senderId;
    this.senderName = data.senderName || 'Unknown';
    this.text = data.text;
    this.type = data.type || 'text';
    this.timestamp = data.timestamp || serverTimestamp();
    // Optional future extension:
    this.readBy = data.readBy || {}; // { uid: Timestamp }
  }

  toFirestore() {
    const { id, ...rest } = this;
    return rest;
  }

  static validate(obj) {
    const errors = [];
    if (!obj.conversationId) errors.push('conversationId is required');
    if (!obj.senderId) errors.push('senderId is required');
    if (!obj.text || !String(obj.text).trim()) errors.push('text is required');
    return { isValid: errors.length === 0, errors };
  }
}

export default Messages;
