// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCaT1ImNJBF_irJafUlBgoe9ZMTv9dW2Qs",
  authDomain: "reactnativedemochatapp.firebaseapp.com",
  projectId: "reactnativedemochatapp",
  storageBucket: "reactnativedemochatapp.firebasestorage.app",
  messagingSenderId: "332258690719",
  appId: "1:332258690719:web:41de7cd5c181ab733384aa",
  measurementId: "G-LMW38HBCLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore 
const db = getFirestore(app);

// Export both auth and db 
export { auth, db };