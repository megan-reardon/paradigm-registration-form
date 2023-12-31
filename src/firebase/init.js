import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import bcrypt from "bcryptjs";

const firebaseConfig = {
  apiKey: "AIzaSyDv8PdePVLlIuY3RhQHy94Oax98hGHcT_Y",
  authDomain: "paradigm-registration-form.firebaseapp.com",
  projectId: "paradigm-registration-form",
  storageBucket: "paradigm-registration-form.appspot.com",
  messagingSenderId: "1095001502405",
  appId: "1:1095001502405:web:0acda571a8c1a72f8b76ac",
  databaseURL:
    "https://paradigm-registration-form-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const writeUserData = async (email, password) => {
  const reference = ref(db, "users/");
  return await push(reference, {
    email,
    password,
  }).catch((error) => {
    throw new Error(`Something went wrong when writing data: ${error}`);
  });
};

export const getUserData = async (email) => {
  const usersRef = query(
    ref(db, "users"),
    ...[orderByChild("email"), equalTo(email)]
  );
  const snapshot = await get(usersRef);
  const data = await snapshot.val();
  return data;
};

export const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};
