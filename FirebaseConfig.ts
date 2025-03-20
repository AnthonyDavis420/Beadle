// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import  ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmfLOetJW9CzW1rjhC1dEsRwidPaqCunI",
  authDomain: "beadle-7b8db.firebaseapp.com",
  projectId: "beadle-7b8db",
  storageBucket: "beadle-7b8db.firebasestorage.app",
  messagingSenderId: "1096719298204",
  appId: "1:1096719298204:web:45273c176ab78af296c759",
  measurementId: "G-BJ945T27BJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});