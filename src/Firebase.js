// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCO7L-D53GrJ5o1IY36sRP_zzpnx7q--g",
  authDomain: "notesapp-93454.firebaseapp.com",
  projectId: "notesapp-93454",
  storageBucket: "notesapp-93454.appspot.com",
  messagingSenderId: "515705734270",
  appId: "1:515705734270:web:489b3f1124db93f431042f",
  measurementId: "G-8B9PKGF2C4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
// Export both 'auth' and 'db'
export { db, storage };
