// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBklA6iGAGJ3rmyQ7m7v-ck8OxnH_sOGgk",
  authDomain: "jinx-chartw.firebaseapp.com",
  projectId: "jinx-chartw",
  storageBucket: "jinx-chartw.appspot.com",
  messagingSenderId: "909901919689",
  appId: "1:909901919689:web:908924225fc44c15fce418"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { auth, storage };