/**
 * Deterministic 1:1 conversation id independent of user order.
 * Example: ("b","a") and ("a","b") -> "a_b"
 * This can also be extended to more than 2 users if needed (Group Chat). We make the ID here.
 */
export const conversationIdForUsers = (a, b) => [a, b].sort().join('_');
