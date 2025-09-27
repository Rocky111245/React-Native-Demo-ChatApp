// Minimal in-memory message rate limiter (client-side UX guard)
const perUser = new Map();          // userId -> { last: number, minute: number[] }
const MESSAGE_COOLDOWN_MS = 1000;
const MAX_PER_MINUTE = 30;

/**
 * Return true if user can send a message now; false if throttled.
 */
export const canSendMessageNow = (userId) => {
  const now = Date.now();
  const rec = perUser.get(userId) || { last: 0, minute: [] };

  // 1-second cooldown
  if (now - rec.last < MESSAGE_COOLDOWN_MS) return false;

  // trim >1 minute-old timestamps
  const minAgo = now - 60_000;
  rec.minute = rec.minute.filter(t => t > minAgo);

  // per-minute cap
  if (rec.minute.length >= MAX_PER_MINUTE) return false;

  // record this send
  rec.last = now;
  rec.minute.push(now);
  perUser.set(userId, rec);
  return true;
};

export const clearRateLimits = () => perUser.clear();
