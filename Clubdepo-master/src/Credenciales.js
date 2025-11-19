// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAw5YtScFl1SzQYeC-z2EJdQjpncBMPx5c",
  authDomain: "clubdeportivo-56fa8.firebaseapp.com",
  projectId: "clubdeportivo-56fa8",
  storageBucket: "clubdeportivo-56fa8.firebasestorage.app",
  messagingSenderId: "502927667461",
  appId: "1:502927667461:web:e953731f3fb3511d2fc76c",
  measurementId: "G-93GYLXMWZP",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
