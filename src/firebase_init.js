import firebase from 'firebase';
import { getFunctions, httpsCallable } from "firebase/functions";

const config = {
  apiKey: "AIzaSyBG6Uo9bwEnxrVhDvxCnnGM88MfBgBm4EY",
  authDomain: "cloutmegazord.firebaseapp.com",
  databaseURL: "https://cloutmegazord-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloutmegazord",
  storageBucket: "cloutmegazord.appspot.com",
  messagingSenderId: "493989806019",
  appId: "1:493989806019:web:05c697b2bfeb2f88a84776",
  measurementId: "G-NJHY4QC4FJ"
};

export default firebase;

export const firebaseApp = firebase.initializeApp(config);
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const messaging = firebase.messaging();
export const functions = firebase.functions()
functions.useEmulator("localhost", 5001);
export const api_functions = {
  'signIn': functions.httpsCallable('api/sign-in'),
  'signUp': functions.httpsCallable('api/sign-up'),
  // 'helloWorld': functions.httpsCallable('signIn')
}