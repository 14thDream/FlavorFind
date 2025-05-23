// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  get,
  getDatabase,
  ref,
  set,
  push,
  serverTimestamp,
} from "firebase/database";

// Firebase Config - Palitan ito ng config mula sa Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBKjfNr4WiAFjS2l8hJA5jED0hx4G3KtJ4",
  authDomain: "itecc06-11193.firebaseapp.com",
  databaseURL:
    "https://itecc06-11193-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "itecc06-11193",
  storageBucket: "itecc06-11193.firebasestorage.app",
  messagingSenderId: "203821599205",
  appId: "1:203821599205:web:f817ecf16b5086a46b070c",
  measurementId: "G-X2N6Z72Q0N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const getNextId = async (table) => {
  const dbRef = ref(db, table);
  const snapshot = await get(dbRef);
  if (!snapshot.exists()) {
    return 1;
  }

  const users = snapshot.val();
  const keys = Object.keys(users);

  const validIds = keys.map((id) => parseInt(id)).filter((id) => !isNaN(id));
  return validIds.length > 0 ? Math.max(...validIds) + 1 : 1;
};

export { db, ref, set, push, serverTimestamp, getNextId };
