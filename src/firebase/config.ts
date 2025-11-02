import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBcFCpB09KcJsUfC54jZj83oDjrnbRjyQ8",
  authDomain: "animallpedia.firebaseapp.com",
  projectId: "animallpedia",
  storageBucket: "animallpedia.firebasestorage.app",
  messagingSenderId: "911946213967",
  appId: "1:911946213967:web:9d7afe560956096117983a",
  measurementId: "G-DWFRPC0H6E",
  databaseURL: "https://animallpedia-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);

// Enable IndexedDB persistence safely without multi-tab synchronization
// This prevents the INTERNAL ASSERTION FAILED errors
if (typeof window !== "undefined" && "indexedDB" in window) {
  // Use a flag to ensure persistence is only attempted once
  const persistenceInitialized = (window as any).__FIRESTORE_PERSISTENCE_INITIALIZED__;
  
  if (!persistenceInitialized) {
    enableIndexedDbPersistence(db)
      .then(() => {
        (window as any).__FIRESTORE_PERSISTENCE_INITIALIZED__ = true;
        console.log("Firestore persistence enabled");
      })
      .catch((err) => {
        (window as any).__FIRESTORE_PERSISTENCE_INITIALIZED__ = true;
        if (err.code === "failed-precondition") {
          console.warn("Firestore persistence failed: multiple tabs open");
        } else if (err.code === "unimplemented") {
          console.warn("Firestore persistence not available in this browser");
        } else {
          console.error("Unexpected Firestore persistence error:", err);
        }
      });
  }
}

const rtdb = getDatabase(app);

export { app, analytics, auth, db, rtdb };