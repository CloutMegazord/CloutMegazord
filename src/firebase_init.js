import firebase from 'firebase';
import { getFunctions, httpsCallable } from "firebase/functions";

const config = {
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
