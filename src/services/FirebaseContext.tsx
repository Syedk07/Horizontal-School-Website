import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  fbSignOut,
  onAuthStateChanged,
  FirebaseUser,
  testFirebaseConnection,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

interface FirebaseContextType {
  firebaseUser: FirebaseUser | null;
  isAdminUser: boolean;
  isFirebaseReady: boolean;
  authLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutFirebase: () => Promise<void>;
  firestoreConnected: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseUser: null,
  isAdminUser: false,
  isFirebaseReady: false,
  authLoading: true,
  loginWithGoogle: async () => {},
  logoutFirebase: async () => {},
  firestoreConnected: false,
});

export const ADMIN_BOOTSTRAP_EMAIL = 'afnanbajhao05@gmail.com';

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);

  useEffect(() => {
    // 1. Validate connection to Firestore as required by instructions
    testFirebaseConnection().then((connected) => {
      setFirestoreConnected(connected);
    });

    // 2. Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Check if admin: either via email match (verified) or exists in admins collection
        const emailMatches = (user.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) && user.emailVerified;
        let dbAdmin = false;
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          dbAdmin = adminDoc.exists();
        } catch {
          // If unauthenticated or no permission yet, ignore
        }
        setIsAdminUser(emailMatches || dbAdmin);

        // Record user document in Firestore users collection if admin or verified
        if (emailMatches || dbAdmin) {
          try {
            await setDoc(doc(db, 'admins', user.uid), {
              email: user.email,
              role: 'admin',
              updatedAt: serverTimestamp(),
            }, { merge: true });
          } catch {
            // Silently continue if rules don't permit write yet
          }
        }
      } else {
        setIsAdminUser(false);
      }
      setAuthLoading(false);
      setIsFirebaseReady(true);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      if (user) {
        // Record public profile
        const path = `users/${user.uid}`;
        try {
          await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: user.email || '',
            username: user.displayName || user.email?.split('@')[0] || 'User',
            role: (user.email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) ? 'admin' : 'student',
            created_at: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          console.warn('Could not sync user profile to firestore (permission or offline):', err);
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const logoutFirebase = async () => {
    try {
      await fbSignOut(auth);
      setFirebaseUser(null);
      setIsAdminUser(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebaseUser,
        isAdminUser,
        isFirebaseReady,
        authLoading,
        loginWithGoogle,
        logoutFirebase,
        firestoreConnected,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
