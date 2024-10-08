// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-DzaxYU-E2a4VtAKF-yjhEpwfvmMou2I",
  authDomain: "jinx-chaty.firebaseapp.com",
  projectId: "jinx-chaty",
  storageBucket: "jinx-chaty.appspot.com",
  messagingSenderId: "523712905405",
  appId: "1:523712905405:web:e3b20098ad9c9fe746f7d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Firebase Firestore and get a reference to the service
const firestore = getFirestore(app);

export { auth, storage, firestore as db };