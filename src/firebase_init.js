import firebase from 'firebase';
import { getFunctions, httpsCallable } from "firebase/functions";

const config = {
  apiKey: "AIzaSyBG6Uo9bwEnxrVhDvxCnnGM88MfBgBm4EY",
  authDomain: "cloutmegazord.firebaseapp.com",
  // databaseURL: "https://cloutmegazord-default-rtdb.europe-west1.firebasedatabase.app",
  databaseURL: "http://localhost:9000/?ns=cloutmegazord-default-rtdb",
  projectId: "cloutmegazord",
  storageBucket: "cloutmegazord.appspot.com",
  messagingSenderId: "493989806019",
  appId: "1:493989806019:web:05c697b2bfeb2f88a84776",
  measurementId: "G-NJHY4QC4FJ"
};

export default firebase;

function getBitcloutAcc(publicKey, Username='') {
  return new Promise(function (resolve, reject) {
    functions.httpsCallable('api/bitclout-proxy')({
      action: 'get-single-profile',
      PublicKeyBase58Check: publicKey,
      Username: Username
    }).then(resp => {
      if (resp.data.error) {
        throw new Error(resp.data.error);
      }
      resolve(resp.data.Profile);
    }).catch(data => {
      reject(data);
    })
  })
}

export const firebaseApp = firebase.initializeApp(config);
export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
// export const messaging = firebase.messaging();
export const functions = firebase.functions()
functions.useEmulator("localhost", 5001);
db.useEmulator("localhost", 9000)
export const api_functions = {
  'login': functions.httpsCallable('api/login'),
  'signInWithCustomToken': auth.signInWithCustomToken.bind(auth),
  'getBitcloutAcc': getBitcloutAcc,
  'onUserData': async (publicKey, callback, errorCallback = () => {}) => {
    var data, userRef = db.ref("users/" + publicKey);
    userRef.on('value', (snapshot) => {
      const userDBData = snapshot.val();
      if (!userDBData) {
        auth.signOut();
        return
      }
      getBitcloutAcc(publicKey)
        .then(userCloutData => {
          callback(Object.assign(userDBData, userCloutData))
        })
        .catch(error=>{
          errorCallback(error)
        })
    })

    // db.ref("users").child(publicKey).get().then(snapshot=> {
    //   var userDBData = snapshot.val();
    //   debugger
    //   return new Promise((resolve, reject) => {
    //     debugger
    //     resolve(userDBData);
    //   })
    // }).then(userDBData=>{
    //   return new Promise((resolve, reject) => {
    //     getBitcloutAcc(publicKey)
    //     .then(userCloutData => {resolve(Object.assign(userDBData, userCloutData))})
    //     .catch(reject)
    //   })
    // }).then(mergedUserData=>{
    //   debugger
    //   callback(mergedUserData);
    //   const userRef = db.ref("users/" + publicKey)
    //   userRef.on('value', (snapshot) => {
    //     const newUserDBData = snapshot.val();
    //     callback({...mergedUserData, newUserDBData})
    //   }).catch(err => {
    //     debugger
    //     errorCallback(err);
    //   });
    // });
    // try {
    //   userRef = await db.ref().child("users").child(publicKey)
    //   const snapshot = await userRef.get();
    //   data = await snapshot.val();
    //   console.log(data)
    //   debugger;
    // } catch(err) {
    //   debugger;
    //   console.log(err)
    //   errorCallback(err)
    // }
    // const bitAcc = await getBitcloutAcc(publicKey);
    // callback({...data, ...bitAcc});
    // userRef = db.ref("users/" + publicKey)
    // userRef.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   callback({...data, ...bitAcc})
    // }).catch(err => {
    //   errorCallback(err);
    // });
  }
  // 'helloWorld': functions.httpsCallable('signIn')
}