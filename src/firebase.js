// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB0wHyUYjUvHflg8Y3Dfy9ue52V3pn1VTU",
  authDomain: "crypto-prediction-d1570.firebaseapp.com",
  projectId: "crypto-prediction-d1570",
  storageBucket: "crypto-prediction-d1570.appspot.com",
  messagingSenderId: "52360482685",
  appId: "1:52360482685:web:664e23c8539cfc62b80614",
  measurementId: "G-B3H5MLHNES"
};

// ✅ Initialize Firebase once
const app = initializeApp(firebaseConfig);

// ✅ Export correctly
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
