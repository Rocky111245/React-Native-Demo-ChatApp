// src/utils/loginScreenValidator.js

// Lightweight validators.

// Regex designed to catch obvious mistakes: missing "@", spaces, no TLD, etc., but allows some odd emails for now.
export const isValidEmail = (email) => {
    if (typeof email !== 'string') return false;
    const e = email.trim();
    if (!e) return false;
    if (e.includes(' ')) return false;
    // basic shape: name@host.tld with at least one dot in the host part
    const simple = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return simple.test(e);
};

// Return an array of problems to the UI.
export const passwordIssues = (pwd) => {
    const issues = [];
    if (!pwd || !pwd.trim()) {
        issues.push('Password is required.');
        return issues;
    }
    if (pwd.length < 6) issues.push('Use at least 6 characters.');
    return issues;
};

// Friendly Firebase auth error messages
export const authErrorMessage = (err) => {
    const code = (err && err.code) || '';
    const map = {
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/invalid-email': 'That email looks malformed.',
        'auth/email-already-in-use': 'That email is already registered.',
        'auth/user-disabled': 'This account is disabled.',
        'auth/user-not-found': 'No account found for that email.',
        'auth/wrong-password': 'Email or password is incorrect.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'Network issue. Check your connection and try again.',
        'auth/weak-password': 'Your password is too weak. Try a longer one.',
    };
    return map[code] || (err?.message ?? 'Something went wrong. Please try again.');
};
