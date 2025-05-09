// Firebase configuration for Expo
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  updateProfile,
  onIdTokenChanged,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Firebase config using Expo environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// NOTE: Google Sign In configuration moved to GoogleSignInButton component

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Authentication functions
export const registerWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user profile with the display name
    await updateProfile(user, { displayName: name });
    
    return user;
  } catch (error) {
    console.error("Error during registration", error);
    throw error;
  }
};

export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error during login", error);
    throw error;
  }
};

// Google Sign In function
export const signInWithGoogle = async () => {
  try {
    console.log('signInWithGoogle: Starting process');
    
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    console.log('signInWithGoogle: Play services available');
    
    // Get the users ID token
    console.log('signInWithGoogle: Attempting to sign in with Google');
    const { idToken } = await GoogleSignin.signIn();
    console.log('signInWithGoogle: Successfully got ID token from Google');
    
    // Create a Google credential with the token
    console.log('signInWithGoogle: Creating Firebase credential');
    const googleCredential = GoogleAuthProvider.credential(idToken);
    
    // Sign-in the user with the credential
    console.log('signInWithGoogle: Signing in with Firebase credential');
    const userCredential = await signInWithCredential(auth, googleCredential);
    console.log('signInWithGoogle: Successfully signed in with Firebase');
    
    return userCredential.user;
  } catch (error) {
    console.error("Error during Google sign in:", error);
    // Additional error information
    if (error.code) {
      console.error(`Google Sign-In error code: ${error.code}`);
    }
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    
    // Sign out from Google if signed in with Google
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  } catch (error) {
    console.error("Error during logout", error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error during password reset", error);
    throw error;
  }
};

// Get the current Firebase ID token
export const getCurrentToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently logged in');
    }
    
    // This will force a token refresh if it's expired
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error getting current token", error);
    throw error;
  }
};

// Set up a token change listener
export const setupTokenRefresh = (callback) => {
  return onIdTokenChanged(auth, async (user) => {
    if (user) {
      // Get the token and pass it to the callback
      const token = await user.getIdToken();
      callback(token);
    } else {
      // User is signed out
      callback(null);
    }
  });
};

export { auth };
export default app; 