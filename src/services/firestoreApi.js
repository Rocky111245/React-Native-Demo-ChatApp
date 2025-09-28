// src/services/FirestoreApi.js
// Forward-only; no logic.

// Users
export {
    upsertUserProfile,
    setUserOnlineStatus,
    getUserById,
    listUsersOrderedByName,
} from '../repos/usersRepo.js';

// Direct conversations
export {
    getConversationByParticipants,
    createDirectConversationIfMissing,
    getExistingDirectConversationOrCreateNew,
    markConversationReadForUser,
    subscribeUserConversationsOrdered,
    appendMessageAndBumpUnreadTxn,
} from '../repos/conversationsRepo.js';

// Messages (shared)
export {
    createNewMessageDocRef,
    buildPlainTextMessagePayload,
    subscribeMessagesByConversationAsc,
} from '../repos/messagesRepo.js';

// Groups
export {
    subscribeUserGroupsOrdered,
    findGroupByParticipantsKey,
    createGroupConversation,
    markGroupConversationReadForUser,
    appendGroupMessageAndBumpUnreadTxn,
} from '../repos/groupsRepo.js';

// Rate limiting
export { canSendMessageNow, clearRateLimits } from '../utils/rateLimits.js';

// IDs / keys
export { conversationIdForUsers, participantsKey } from '../utils/ids.js';

// Global listener registry
export {
    registerListener,
    cleanupListener,
    cleanupAllListeners,
} from '../utils/listeners.js';
