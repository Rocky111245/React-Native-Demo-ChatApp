// src/services/FirestoreApi.js
// Thin façade: forward-only; no logic.

export {
  upsertUserProfile,
  setUserOnlineStatus,
  getUserById,
  listUsersOrderedByName,
} from '../repos/usersRepo.js';

export {
  getConversationByParticipants,
  createDirectConversationIfMissing,
  getExistingDirectConversationOrCreateNew,
  markConversationReadForUser,
  subscribeUserConversationsOrdered,
  appendMessageAndBumpUnreadTxn,
} from '../repos/conversationsRepo.js';

export {
  createNewMessageDocRef,
  buildPlainTextMessagePayload,
  subscribeMessagesByConversationAsc,
} from '../repos/messagesRepo.js';

export {
  canSendMessageNow,
  clearRateLimits,
} from '../utils/rateLimits.js';

export { conversationIdForUsers } from '../utils/ids.js';

// global listener registry (optional)
export {
  registerListener,
  cleanupListener,
  cleanupAllListeners,
} from '../utils/listeners.js';
