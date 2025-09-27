// src/models/User.js
import { serverTimestamp } from 'firebase/firestore';

/**
 * User Model - Defines user data structure and validation
 */

export class User {
  constructor(data) {
    this.uid = data.uid;
    this.email = data.email;
    this.displayName = data.displayName || this.generateDisplayName(data.email);
    this.avatar = data.avatar || null;
    this.isOnline = data.isOnline || false;
    this.lastSeen = data.lastSeen || serverTimestamp();
    this.createdAt = data.createdAt || serverTimestamp();
  }

  // Generate display name from email
  generateDisplayName(email) {
    return email.split('@')[0];
  }

  // Validate user data
  static validate(userData) {
    const errors = [];

    if (!userData.uid) {
      errors.push('uid is required');
    }

    if (!userData.email) {
      errors.push('email is required');
    } else if (!this.isValidEmail(userData.email)) {
      errors.push('email format is invalid');
    }

    if (userData.displayName && userData.displayName.length > 50) {
      errors.push('displayName must be less than 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      avatar: this.avatar,
      isOnline: this.isOnline,
      lastSeen: this.lastSeen,
      createdAt: this.createdAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      uid: doc.id,
      ...data
    });
  }

  // Get user's initials for avatar
  getInitials() {
    return this.displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Check if user was recently active
  isRecentlyActive() {
    if (!this.lastSeen || typeof this.lastSeen.toMillis !== 'function') {
      return false;
    }
    
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    return this.lastSeen.toMillis() > fiveMinutesAgo;
  }

  // Get status text
  getStatusText() {
    if (this.isOnline) {
      return 'Online';
    } else if (this.isRecentlyActive()) {
      return 'Recently active';
    } else {
      return 'Offline';
    }
  }
}

// User schema definition (for reference)
export const USER_SCHEMA = {
  uid: 'string (required)',
  email: 'string (required, valid email)',
  displayName: 'string (max 50 chars)',
  avatar: 'string (optional, URL)',
  isOnline: 'boolean',
  lastSeen: 'Timestamp',
  createdAt: 'Timestamp'
};

export default User;