import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtYXUk1xqthOLrCYrU0hrNJWh45CyYRB0",
  authDomain: "devboard-40f16.firebaseapp.com",
  projectId: "devboard-40f16",
  storageBucket: "devboard-40f16.firebasestorage.app",
  messagingSenderId: "1007039542071",
  appId: "1:1007039542071:web:fb113a3672734c0b62e0b2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
