import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "",
};

const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let app: FirebaseApp | null = null;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

export const auth = app ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope("email");
googleProvider.addScope("profile");

export async function signInWithGoogle(): Promise<{ name: string; email: string; avatar?: string } | null> {
  if (!auth) {
    console.warn("Firebase not configured. Add VITE_FIREBASE_* env vars to enable Google sign-in.");
    return null;
  }
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  return {
    name:   user.displayName || "User",
    email:  user.email || "",
    avatar: user.photoURL || undefined,
  };
}

export async function signOutFromGoogle(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function onFirebaseAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

export { isFirebaseConfigured };
