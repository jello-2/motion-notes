// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getStorage } from "firebase/storage";


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb1VzLULLP5JHQ-NWzQGp5AM2igZQDoKY",
  authDomain: "yvrnotes-77c78.firebaseapp.com",
  projectId: "yvrnotes-77c78",
  storageBucket: "yvrnotes-77c78.appspot.com",
  messagingSenderId: "330609223891",
  appId: "1:330609223891:web:427fbae0f400f9c12c0c26",
  measurementId: "G-WB86DLPE4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
// Export both 'auth' and 'db'
export { db, storage };
