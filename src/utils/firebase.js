// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//import { getDatabase } from "firebase/database";
//import "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { browserLocalPersistence, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW__BZ5zb14SpSGDagHclZje3H7CyPN-s",
  authDomain: "testing-ca9b2.firebaseapp.com",
  projectId: "testing-ca9b2",
  storageBucket: "testing-ca9b2.appspot.com",
  messagingSenderId: "985984429648",
  appId: "1:985984429648:web:08bb2eeaa706f7ec252b55",
  measurementId: "G-55X4W4FLSX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app, {
  persistence: browserLocalPersistence
});
