// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATAMTJjyjll4wCVc9ichTEVKtEVF6WF7k",
  authDomain: "fyp-db-ffa1e.firebaseapp.com",
  projectId: "fyp-db-ffa1e",
  storageBucket: "fyp-db-ffa1e.firebasestorage.app",
  messagingSenderId: "838350159911",
  appId: "1:838350159911:web:806592c7d030492e378e02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };