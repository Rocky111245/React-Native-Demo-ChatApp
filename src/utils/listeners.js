// src/utils/listeners.js
const activeUnsubs = new Map(); // key: string -> unsubscribe function

export const registerListener = (key, unsub) => {
  if (activeUnsubs.has(key)) {
    try { activeUnsubs.get(key)(); } catch {}
  }
  activeUnsubs.set(key, unsub);
};

export const cleanupListener = (key) => {
  if (!activeUnsubs.has(key)) return;
  try { activeUnsubs.get(key)(); } catch {}
  activeUnsubs.delete(key);
};

export const cleanupAllListeners = () => {
  activeUnsubs.forEach((unsub) => { try { unsub(); } catch {} });
  activeUnsubs.clear();
  console.log('All Firestore listeners cleaned up');
};
