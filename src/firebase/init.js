import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDv8PdePVLlIuY3RhQHy94Oax98hGHcT_Y",
  authDomain: "paradigm-registration-form.firebaseapp.com",
  projectId: "paradigm-registration-form",
  storageBucket: "paradigm-registration-form.appspot.com",
  messagingSenderId: "1095001502405",
  appId: "1:1095001502405:web:0acda571a8c1a72f8b76ac",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();

export default db;
