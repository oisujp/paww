import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const uploadImage = async (uri: string) => {
  try {
    // Convert Base64 data to a Blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const fileName = "hoge.jpg";
    const storageRef = ref(storage, `images/${fileName}`);

    const snapshot = await uploadBytes(storageRef, blob);
    console.info(snapshot);
  } catch (e) {
    console.error(e);
  }
};
