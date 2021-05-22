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
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify({}))
}
function getBitcloutAcc(publicKey, Username='') {
  return new Promise(function (resolve, reject) {
    var users = JSON.parse(localStorage.getItem('users'));
    if (!users) {
      localStorage.setItem('users', JSON.stringify({}));
      users = {};
    }
    if (users[publicKey]) {
      resolve(users[publicKey])
    }
    functions.httpsCallable('api/bitclout-proxy')({
      action: 'get-single-profile',
      PublicKeyBase58Check: publicKey,
      Username: Username
    }).then(resp => {
      if (resp.data.error) {
        throw new Error(resp.data.error);
      }
      var Profile =  resp.data.Profile;
      Profile.id = Profile.PublicKeyBase58Check;
      Profile.PubKeyShort = Profile.PublicKeyBase58Check.slice(0, 6) + '...'
      Profile.ProfilePic = Profile.ProfilePic || '/assets/img/default_profile_pic.png';
      users[Profile.id] = Profile;
      localStorage.setItem('users', JSON.stringify(users))
      resolve(Profile);
    }).catch(data => {
      reject(data);
    })
  })
}

const defaultAvatar = 'https://cdn.pixabay.com/photo/2019/09/26/19/08/hourglass-4506807__340.png'
async function handleMegazord(megazordInfo, user) {
  megazordInfo.pendingZords = megazordInfo.pendingZords || {};
  megazordInfo.confirmedZords = megazordInfo.confirmedZords || {};
  var resultMegazord = {zords: [], id: megazordInfo.id, canConfirm: false, tasks: []};

  for (let k in megazordInfo.tasks || {}) {
    let task =  megazordInfo.tasks[k];
    task.id = k;
    task.addedBy = await getBitcloutAcc(Object.keys(task.addedBy)[0]);
    resultMegazord.tasks.push(task);
  }
  if (Object.keys(megazordInfo.pendingZords).length > 0) {
    resultMegazord.status_id = 1;
    resultMegazord.status_text = 'Pending zords confirmation';
  } else if (resultMegazord.publicKey) {
    resultMegazord.status_id = 0;
    resultMegazord.status_text = 'Active';
  } else {
    resultMegazord.status_id = 2;
    resultMegazord.status_text = 'Pending actvation';
  }
  for (let k in megazordInfo.pendingZords) {
    let cloutAccount = await getBitcloutAcc(k);
    resultMegazord.canConfirm = k === user.id;
    resultMegazord.zords.push({
      avatar: cloutAccount.ProfilePic,
      status: 'pending',
      name: cloutAccount.Username,
      link: 'https://bitclout.com/u/' + cloutAccount.Username
    });
  }
  for (let k in megazordInfo.confirmedZords) {
    let cloutAccount = await api_functions.getBitcloutAcc(k);
    resultMegazord.zords.push({
      avatar: cloutAccount.ProfilePic,
      status: 'confirmed',
      name: cloutAccount.Username,
      link: 'https://bitclout.com/u/' + cloutAccount.Username
    });
  }
  resultMegazord.ProfilePic = resultMegazord.ProfilePic || defaultAvatar;
  resultMegazord.Username = resultMegazord.Username || resultMegazord.PubKeyShort || 'Not Activated';
  return resultMegazord;
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
  'getTaskSession': () => {
    var path = window.location.href.split('/').pop();
    var task = path.split('&')[0].split('=')[1];
    return functions.httpsCallable('api/getTaskSession')({
      task: task
    });
  },
  'task': functions.httpsCallable('api/task'),
  'login': functions.httpsCallable('api/login'),
  'logout': () => {
    localStorage.setItem('users', null);
    auth.signOut();
  },
  'createMegazord': zords => {
    ///* forceRefresh */ true
    return new Promise((resolve, reject) => {
      functions.httpsCallable('api/createMegazord')({zords}).then(resolve).catch(reject);
    })
  },
  'confirmMegazord': megazordId => {
    return new Promise((resolve, reject) => {
      functions.httpsCallable('api/confirmMegazord')({megazordId}).then(resolve).catch(reject);
    })
  },
  'signInWithCustomToken': auth.signInWithCustomToken.bind(auth),
  'getBitcloutAcc': getBitcloutAcc,
  'onUserData': async (publicKey, callback, errorCallback = () => {}) => {
    var data, userRef = db.ref("users/" + publicKey);
    userRef.on('value', async (snapshot) => {
      const userDBData = snapshot.val();
      if (!userDBData) {
        auth.signOut();
        return
      }
      var userCloutData = await getBitcloutAcc(publicKey);
      let resUser = Object.assign(userDBData, userCloutData);
      resUser.id = publicKey;
      const megazordsIds = resUser.megazords;
      if (!megazordsIds) {
        callback(resUser);
        return
      }
      resUser.megazords = {}
      for (let k in megazordsIds) {
        db.ref("megazords/" + k).on('value', async snapshot=> {
          const megazordData = snapshot.val();
          var id = snapshot.getRef().key;
          if (!megazordData) {
            db.ref("megazords/" + id).off('value');
            return;
          };
          megazordData.id = id;
          resUser.megazords[id] = await handleMegazord(megazordData, resUser);
          callback(resUser);
        }, error=>{
          errorCallback(error)
        });
      }
    })
  },
  'offUserData': () => {}
  // 'helloWorld': functions.httpsCallable('signIn')
}