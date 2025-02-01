// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fakethread.firebaseapp.com",
  projectId: "fakethread",
  storageBucket: "fakethread.firebasestorage.app",
  messagingSenderId: "1003703524685",
  appId: "1:1003703524685:web:588e8066eed54784c26b04"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);