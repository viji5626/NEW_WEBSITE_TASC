import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TASC Automation Production Firebase Config (from user screenshot)
const prodConfig = {
  apiKey: "AIzaSyCFxxWI4oNPJnaJ-_vIRiaJAfGC-N-iHYI",
  authDomain: "tascautomation.firebaseapp.com",
  projectId: "tascautomation",
  storageBucket: "tascautomation.firebasestorage.app",
  messagingSenderId: "1066069413441",
  appId: "1:1066069413441:web:b60710323fa35bad2400c0",
  measurementId: "G-T39CZCMXWH",
  firestoreDatabaseId: "(default)"
};

const firebaseConfig = prodConfig;

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error: any) {
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
             // Fallback to redirect
             await signInWithRedirect(auth, googleProvider);
        } else {
             console.error("Error signing in with Google:", error);
             throw error;
        }
    }
}

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}
