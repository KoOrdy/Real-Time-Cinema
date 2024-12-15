// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1blFqh-EBiIv2QKxUtPFnO-XVxoNfjuc",
  authDomain: "real-time-cinema.firebaseapp.com",
  projectId: "real-time-cinema",
  storageBucket: "real-time-cinema.firebasestorage.app",
  messagingSenderId: "569929800297",
  appId: "1:569929800297:web:fff0849405e940969c20f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore, collection, getDocs, onSnapshot };
