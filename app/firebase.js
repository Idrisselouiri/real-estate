// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "next-real-estate-c2ab0.firebaseapp.com",
  projectId: "next-real-estate-c2ab0",
  storageBucket: "next-real-estate-c2ab0.appspot.com",
  messagingSenderId: "278868693447",
  appId: "1:278868693447:web:446e8bf3c2ebc1d63989e2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
