/**
 * Deterministic 1:1 conversation id independent of user order.
 * Example: ("b","a") and ("a","b") -> "a_b"
 * This can also be extended to more than 2 users if needed (Group Chat). I make the ID here.
 */
export const conversationIdForUsers = (a, b) => [a, b].sort().join('_');

/**
 * Stable, deduplicated key for any participant set (2+ users).
 * Example: ["u3","u1","u1","u2"] -> "u1_u2_u3"
 * Use this to de-duplicate/find existing group conversations.
 */
export const participantsKey = (uids) => {
    if (!Array.isArray(uids)) return '';
    return [...new Set(uids)].sort().join('_');
};