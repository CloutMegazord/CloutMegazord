import firebase from 'firebase';
import axios from 'axios';
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
export const firebaseApp = firebase.initializeApp(config);
export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
// export const messaging = firebase.messaging();
export const functions = firebase.functions()
functions.useEmulator("localhost", 5001);
db.useEmulator("localhost", 9000)

export const onErrorSubscribers = [];
const fireError = (e) => {
  onErrorSubscribers.forEach(func => func(e))
}
const waitingMegazordAvatar = '/assets/img/waitingMegazord.png';
const defaultAvatar = '/assets/img/default_profile_pic.png';

function IsJsonString(str) {
  try {JSON.parse(str);} catch (e) {return false;}
  return true;
}

function getFromStorage(namespace, key) {
  var res = null;
  var item = localStorage.getItem(namespace);
  if (!item || !IsJsonString(item)) {
    localStorage.setItem(namespace, JSON.stringify({}));
    return null;
  }
  var namespaceObj = JSON.parse(localStorage.getItem(namespace));
  if (namespaceObj[key]) {
    if (Date.now() > namespaceObj[key].expired) {
      delete namespaceObj[key]
      localStorage.setItem(namespace, JSON.stringify(namespaceObj));
    } else {
      res = namespaceObj[key];
    }
  }
  return res;
}

function getBitcloutAcc(publicKey, Username='') {
  return new Promise(function (resolve, reject) {
    var user = getFromStorage('users', publicKey);
    if (user) {
      resolve(user)
      return;
    }
    functions.httpsCallable('api/bitclout-proxy')({
      action: 'get-single-profile',
      PublicKeyBase58Check: publicKey,
      Username: Username
    }).then(resp => {
      if (resp.data.error) {
        reject(resp.data.error);
        return;
      }
      var Profile =  resp.data.Profile;
      Profile.id = Profile.PublicKeyBase58Check;
      Profile.PubKeyShort = Profile.PublicKeyBase58Check.slice(0, 6) + '...'
      Profile.ProfilePic = Profile.ProfilePic || defaultAvatar;

      var users = JSON.parse(localStorage.getItem('users'))
      users[Profile.id] = Profile;
      users[Profile.id].expired = Date.now() + (48 * 60 * 60 * 1000)
      localStorage.setItem('users', JSON.stringify(users))
      resolve(Profile);
    }).catch(data => {
      reject(data);
    })
  })
}

function getExchangeRate() {
  return new Promise(async function (resolve, reject) {
    var exchangeRate = getFromStorage('bitcloutData', 'exchangeRate');
    if (exchangeRate) {
      resolve(exchangeRate)
      return;
    }
    try {
      var exRateResp = await functions.httpsCallable('api/bitclout-proxy')({method: 'get', action: 'get-exchange-rate'});
      var tickerResp = await axios.get('https://blockchain.info/ticker');
    } catch (e) {
      reject(e);
      return
    }
    if (exRateResp.data.error) {
      reject(exRateResp.data.error);
      return
    }

    var bitcloutData = JSON.parse(localStorage.getItem('bitcloutData'))
    var exchangeRate = exRateResp.data;
    if (tickerResp.data.error) {
      reject(tickerResp.data.error);
    }
    var ticker = tickerResp.data;
    // var exchangeRate =  (ticker.USD.last / 100) * (exchangeRate.SatoshisPerBitCloutExchangeRate / 100000000)
    var exchangeRate =  {
      SatoshisPerBitCloutExchangeRate: exchangeRate.SatoshisPerBitCloutExchangeRate,
      USDCentsPerBitcoinExchangeRate: ticker.USD.last,
      USDbyBTCLT: (ticker.USD.last / 100) * (exchangeRate.SatoshisPerBitCloutExchangeRate / 100000000)
    }
    exchangeRate.expired = Date.now() + (1 * 60 * 60 * 1000)
    bitcloutData.exchangeRate = exchangeRate;
    localStorage.setItem('bitcloutData', JSON.stringify(bitcloutData))
    resolve(exchangeRate);

  });
}

async function handleMegazord(megazordInfo, user) {
  megazordInfo.pendingZords = megazordInfo.pendingZords || {};
  megazordInfo.confirmedZords = megazordInfo.confirmedZords || {};
  var resultMegazord = {zords: [], id: megazordInfo.id, canConfirm: false, tasks: []};

  for (let k in megazordInfo.tasks || {}) {
    let task =  megazordInfo.tasks[k];
    task.id = k;
    task.addedBy = await api_functions.getBitcloutAcc(Object.keys(task.addedBy)[0]);
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
    let cloutAccount = await api_functions.getBitcloutAcc(k);
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
  if (!resultMegazord.ProfilePic) {
    if (resultMegazord.PublicKeyBase58Check) {
      resultMegazord.ProfilePic = defaultAvatar;
    } else {
      resultMegazord.ProfilePic = waitingMegazordAvatar;
    }
  }
  resultMegazord.Username = resultMegazord.Username || resultMegazord.PubKeyShort || 'Not Activated';
  return resultMegazord;
}

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
  'getBitcloutAcc': (publicKey, Username) => {
    return new Promise((resolve, reject) => {
      getBitcloutAcc(publicKey, Username).then(resolve).catch(e=>{
        fireError('Get Bitclout Account ' + e);
        reject(e);
      })
    })
  },
  'getExchangeRate': data => {
    return new Promise((resolve, reject) => {
      getExchangeRate(data).then(resolve).catch(e=>{
        fireError('Get Bitclout Exchange Rate ' + e);
        reject(e);
      })
    })
  },
  'getFeesMap': () => {
    return {
      3: 1 * 10**4,
      2: 1 * 10**5,
      1: 1 * 10**6,
      0.5: Infinity
    }
  },
  'onUserData': async (publicKey, callback, errorCallback = () => {}) => {
    var data, userRef = db.ref("users/" + publicKey);
    userRef.on('value', async (snapshot) => {
      const userDBData = snapshot.val();
      if (!userDBData) {
        auth.signOut();
        return
      }
      var userCloutData = await api_functions.getBitcloutAcc(publicKey);
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
  'offUserData': () => {},
  'onError': (subscriber) => {
    onErrorSubscribers.push(subscriber);
  }
  // 'helloWorld': functions.httpsCallable('signIn')
}