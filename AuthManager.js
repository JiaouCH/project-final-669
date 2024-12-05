// in AuthManager.js

import { getAuth, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut as fbSignOut, 
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged,
} from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from './Secrets';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

let app, auth;
// this guards against initializing more than one "App"
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}

try {
  // This will throw an auth/already-initialized error if 
  // auth is already instantiated. The try{} block lets this
  // happen gracefully.
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  auth = getAuth(app); // if auth already initialized
}


const signIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
}

const signOut = async () => {
  await fbSignOut(auth);
}

const signUp = async (displayName, email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCred.user, {displayName: displayName});
}

const getAuthUser = () => {
  return auth.currentUser;
}

const subscribeToAuthChanges = (navigation) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('signed in! user:', user);
      navigation.navigate('Home');
    } else {
      console.log('user is signed out!');
      navigation.navigate('Login');
    }
  })
}

export { signUp, signIn, signOut, getAuthUser, subscribeToAuthChanges };