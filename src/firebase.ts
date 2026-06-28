import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, increment, serverTimestamp, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEuaf_p1sVh0eu6V4aJdJfWgM0_304YQc",
  authDomain: "you-are-an-idioat.firebaseapp.com",
  projectId: "you-are-an-idioat",
  storageBucket: "you-are-an-idioat.firebasestorage.app",
  messagingSenderId: "709449108595",
  appId: "1:709449108595:web:a9bd3400f11b888d506e06",
  measurementId: "G-HE0K2FJMES"
};

// Initialize Firebase safely inside a try-catch to avoid crashing on blocked networks/browsers
export let db: Firestore | null = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase initialization failed. Continuing offline:", e);
}

// Reference to the single stats document
function getStatsDocRef() {
  if (!db) return null;
  try {
    return doc(db, "user", "stats");
  } catch (e) {
    console.error("Failed to get Firestore document reference:", e);
    return null;
  }
}

// Function to register a new unit/visitor if not already registered locally
export async function registerVisitorIfNeeded(): Promise<void> {
  try {
    const statsDocRef = getStatsDocRef();
    if (!statsDocRef) {
      console.warn("Skipping visitor registration: database not initialized");
      return;
    }

    // Try reading localStorage safely (might throw in private mode or if disabled)
    let hasRegistered = null;
    try {
      hasRegistered = localStorage.getItem("idiot_registered_v1");
    } catch (e) {
      console.warn("localStorage not accessible:", e);
    }

    if (!hasRegistered) {
      // Set/update the single document with an merged count increment and timestamp
      await setDoc(statsDocRef, {
        count: increment(1),
        last_updated: serverTimestamp(),
        // Keep brief anonymous client details of the last browser to enter
        last_visitor: {
          userAgent: (navigator.userAgent || "unknown").substring(0, 150),
          language: navigator.language || "unknown",
          referrer: (document.referrer || "direct").substring(0, 150)
        }
      }, { merge: true });
      
      try {
        localStorage.setItem("idiot_registered_v1", "true");
      } catch (e) {
        console.warn("localStorage set failed:", e);
      }
      console.log("Registered first-time visitor in the single stats document!");
    } else {
      console.log("Visitor already registered previously.");
    }
  } catch (error) {
    console.error("Error registering visitor:", error);
  }
}

// Function to track how many times a user clicked/started each specific page level
export async function registerPageClick(pageNumber: number): Promise<void> {
  try {
    const statsDocRef = getStatsDocRef();
    if (!statsDocRef) {
      console.warn("Skipping page click registration: database not initialized");
      return;
    }

    const fieldName = `page_${pageNumber}_clicks`;
    await setDoc(statsDocRef, {
      [fieldName]: increment(1),
      last_updated: serverTimestamp(),
      last_visitor: {
        userAgent: (navigator.userAgent || "unknown").substring(0, 150),
        language: navigator.language || "unknown",
        referrer: (document.referrer || "direct").substring(0, 150)
      }
    }, { merge: true });
    console.log(`Registered click on page ${pageNumber} successfully!`);
  } catch (error) {
    console.error(`Error registering click on page ${pageNumber}:`, error);
  }
}

// Function to get the total count of unique visitors from the single stats document
export async function getVisitorCount(): Promise<number> {
  try {
    const statsDocRef = getStatsDocRef();
    if (!statsDocRef) return 0;

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
