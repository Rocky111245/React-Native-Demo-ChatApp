// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);