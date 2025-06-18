import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  // User, // Removed from here
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import type { User } from 'firebase/auth'; // Added as type-only import
import firebaseApp from '../firebase-config'; // Ensure this path is correct

// Define the shape of the context value
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Define props for the AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [auth]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the currentUser
    } catch (error) {
      console.error("Error signing in with Google:", error);
      // Handle errors (e.g., display a message to the user)
    } finally {
      // setLoading(false); // setLoading is handled by onAuthStateChanged
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // onAuthStateChanged will handle setting currentUser to null
    } catch (error) {
      console.error("Error signing out:", error);
      // Handle errors
    } finally {
      // setLoading(false); // setLoading is handled by onAuthStateChanged
    }
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
