// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { upsertUserProfile, setUserOnlineStatus } from '../services/firestoreApi';

const AuthContext = createContext({});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // track last known uid to handle unexpected sign-outs / token expiry
  const lastUidRef = useRef(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          
          await upsertUserProfile(firebaseUser);
          await setUserOnlineStatus(firebaseUser.uid, true);
          lastUidRef.current = firebaseUser.uid;
          setUser(firebaseUser);
        } else {
          if (lastUidRef.current) {
            try { await setUserOnlineStatus(lastUidRef.current, false); } catch {}
            lastUidRef.current = null;
          }
          setUser(null);
        }
      } catch (e) {
        console.error('Auth state handling error:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Keep presence in sync when `user` changes and on unmount
  useEffect(() => {
    if (user?.uid) {
      setUserOnlineStatus(user.uid, true).catch(() => {});
      lastUidRef.current = user.uid;
    }
    return () => {
      if (lastUidRef.current) {
        setUserOnlineStatus(lastUidRef.current, false).catch(() => {});
      }
    };
  }, [user?.uid]); // run whenever the uid changes

  const register = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will populate Firestore & presence
    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will populate Firestore & presence
    return cred.user;
  };

  const logout = async () => {
    // Mark offline before signOut for a clean exit
    if (user?.uid) {
      await setUserOnlineStatus(user.uid, false).catch(() => {});
    }
    await signOut(auth);
  };

  const value = { user, loading, register, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};