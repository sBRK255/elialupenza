import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBLj9_DxqlWADhWvai73d8uV-tzWO-hTrQ",
  authDomain: "elia-lupenza.firebaseapp.com",
  projectId: "elia-lupenza",
  storageBucket: "elia-lupenza.firebasestorage.app",
  messagingSenderId: "103140560705",
  appId: "1:103140560705:web:7b7509efc08cbdad2c5bc0",
  measurementId: "G-19TJZX32J5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
