// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF1ndVQuSzByZ9BQoz8WKtOU7LpZBPfpI",
  authDomain: "image-editor-task.firebaseapp.com",
  projectId: "image-editor-task",
  storageBucket: "image-editor-task.appspot.com",
  messagingSenderId: "307484310459",
  appId: "1:307484310459:web:df6e6d17d98856f61ea29e",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };
