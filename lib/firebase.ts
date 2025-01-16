import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_JNKzSacDK-iqDU5L-VeP8Q8IuY4ILtI",
  authDomain: "lucky-cat-dev.firebaseapp.com",
  projectId: "lucky-cat-dev",
  storageBucket: "lucky-cat-dev.firebasestorage.app",
  messagingSenderId: "679235528038",
  appId: "1:679235528038:web:c83250afd0f28238af54a7",
  measurementId: "G-3TH27BPW3N",
};

export const app = initializeApp(firebaseConfig);
