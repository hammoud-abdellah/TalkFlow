import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC65Bk6Vmyh7DO5TP9Gn8_rmaNruRvYLx8",
  authDomain: "talkflow-24eb1.firebaseapp.com",
  projectId: "talkflow-24eb1",
  storageBucket: "talkflow-24eb1.firebasestorage.app",
  messagingSenderId: "842520969695",
  appId: "1:842520969695:web:81594e2f839a37c8a7446a",
  measurementId: "G-0EE0DRTF4K"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
// export const storage = getStorage();
export const db = getFirestore();