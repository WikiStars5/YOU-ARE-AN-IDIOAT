import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, increment, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEuaf_p1sVh0eu6V4aJdJfWgM0_304YQc",
  authDomain: "you-are-an-idioat.firebaseapp.com",
  projectId: "you-are-an-idioat",
  storageBucket: "you-are-an-idioat.firebasestorage.app",
  messagingSenderId: "709449108595",
  appId: "1:709449108595:web:a9bd3400f11b888d506e06",
  measurementId: "G-HE0K2FJMES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Reference to the single stats document
const statsDocRef = doc(db, "user", "stats");

// Function to register a new unit/visitor if not already registered locally
export async function registerVisitorIfNeeded(): Promise<void> {
  try {
    const hasRegistered = localStorage.getItem("idiot_registered_v1");
    if (!hasRegistered) {
      // Set/update the single document with an merged count increment and timestamp
      await setDoc(statsDocRef, {
        count: increment(1),
        last_updated: serverTimestamp(),
        // Keep brief anonymous client details of the last browser to enter
        last_visitor: {
          userAgent: navigator.userAgent.substring(0, 150),
          language: navigator.language,
          referrer: (document.referrer || "direct").substring(0, 150)
        }
      }, { merge: true });
      
      localStorage.setItem("idiot_registered_v1", "true");
      console.log("Registered first-time visitor in the single stats document!");
    } else {
      console.log("Visitor already registered previously.");
    }
  } catch (error) {
    console.error("Error registering visitor:", error);
  }
}

// Function to get the total count of unique visitors from the single stats document
export async function getVisitorCount(): Promise<number> {
  try {
    const snap = await getDoc(statsDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return typeof data.count === "number" ? data.count : 0;
    }
    return 0;
  } catch (error) {
    console.error("Error getting visitor count:", error);
    return 0;
  }
}
