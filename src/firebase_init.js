import firebase from 'firebase';
import axios from 'axios';

var config = {
  apiKey: "AIzaSyBG6Uo9bwEnxrVhDvxCnnGM88MfBgBm4EY",
  authDomain: "cloutmegazord.firebaseapp.com",
  databaseURL: "https://cloutmegazord-default-rtdb.europe-west1.firebasedatabase.app",
  databaseURL: "http://localhost:9000/?ns=cloutmegazord-default-rtdb",
  projectId: "cloutmegazord",
  storageBucket: "cloutmegazord.appspot.com",
  messagingSenderId: "493989806019",
  appId: "1:493989806019:web:05c697b2bfeb2f88a84776",
  measurementId: "G-NJHY4QC4FJ"
};

if (window.location.hostname === "localhost") {
  config.databaseURL = "http://localhost:9000/?ns=cloutmegazord-default-rtdb";
}
export default firebase;
export const firebaseApp = firebase.initializeApp(config);
export const db = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
// export const messaging = firebase.messaging();
export const functions = firebase.functions();

var apiEndpoint = 'https://cloutmegazord.web.app/api';
if (window.location.hostname === "localhost") {
  apiEndpoint = 'http://localhost:5000/api';
  db.useEmulator("localhost", 9000)
  // functions.useEmulator("localhost", 5001);
}
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
  if (!item || item === 'null' || !IsJsonString(item)) {
    localStorage.setItem(namespace, JSON.stringify({}));
    return null;
  }
  var namespaceObj = JSON.parse(localStorage.getItem(namespace));
  if (namespaceObj && (key in namespaceObj)) {
    if (Date.now() > namespaceObj[key].expired) {
      delete namespaceObj[key]
      localStorage.setItem(namespace, JSON.stringify(namespaceObj));
    } else {
      res = namespaceObj[key];
    }
  }
  return res;
}

function getUserStateless(publicKey) {
  return new Promise(function (resolve, reject) {
    axios.post(apiEndpoint + '/bitclout-proxy', {data:{
      action: 'get-users-stateless',
      PublicKeysBase58Check: [publicKey],
      SkipHodlings: true
    }}).then(resp => {
      if (resp.data.error) {
        reject(resp.data.error);
        return;
      }
      resolve(resp.data.UserList[0]);
    }).catch(err => {
      reject(err);
    })
  })
}

function getBitcloutAcc(publicKey='', Username='') {
  return new Promise(function (resolve, reject) {
    var user = getFromStorage('users', publicKey) || getFromStorage('users', Username);
    if (user) {
      resolve(user)
      return;
    }
    axios.post(apiEndpoint + '/bitclout-proxy', {data:{
      action: 'get-single-profile',
      PublicKeyBase58Check: publicKey,
      Username: Username
    }}).then(resp => {
      if (resp.data.error) {
        reject(resp.data.error);
        return;
      }
      var Profile =  resp.data.Profile;
      Profile.id = Profile.PublicKeyBase58Check;
      Profile.PubKeyShort = Profile.PublicKeyBase58Check.slice(0, 12) + '...'
      Profile.ProfilePic = Profile.ProfilePic || defaultAvatar;

      var users = JSON.parse(localStorage.getItem('users'))
      users[Profile.id] = Profile;
      users[Profile.id].expired = Date.now() + (48 * 60 * 60 * 1000)
      users[Profile.Username] = users[Profile.id];
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
      var exRateResp = await axios.post(apiEndpoint + '/getExchangeRate', {data:{}})//functions.httpsCallable('api/getExchangeRate')({});
    } catch (e) {
      reject(e);
      return
    }
    if (exRateResp.data.error) {
      reject(exRateResp.data.error);
      return
    }

    var exchangeRate = exRateResp.data;
    var bitcloutData = JSON.parse(localStorage.getItem('bitcloutData'))
    exchangeRate.expired = Date.now() + (1 * 60 * 60 * 1000)
    var bitcloutData = JSON.parse(localStorage.getItem('bitcloutData'))
    bitcloutData.exchangeRate = exchangeRate;
    localStorage.setItem('bitcloutData', JSON.stringify(bitcloutData))
    resolve(exchangeRate);
  });
}

async function handleMegazord(megazordInfo, user) {
  megazordInfo.pendingZords = megazordInfo.pendingZords || {};
  megazordInfo.confirmedZords = megazordInfo.confirmedZords || {};
  var resultMegazord = {
    zords: [],
    id: megazordInfo.id,
    canConfirm: false,
    tasks: [],
    PublicKeyBase58Check: megazordInfo.PublicKeyBase58Check
  };

  for (let k in megazordInfo.tasks || {}) {
    let task =  megazordInfo.tasks[k];
    task.id = k;
    task.addedBy = await api_functions.getBitcloutAcc(task.addedBy);
    resultMegazord.tasks.push(task);
  }
  if (Object.keys(megazordInfo.pendingZords).length > 0) {
    resultMegazord.status_id = 1;
    resultMegazord.status_text = 'Pending zords confirmation';
  } else if (resultMegazord.PublicKeyBase58Check) {
    var megazordStateless = await api_functions.getUserStateless(resultMegazord.PublicKeyBase58Check);
    resultMegazord.status_id = 0;
    resultMegazord.status_text = 'Active';
    resultMegazord = Object.assign(resultMegazord, megazordStateless.ProfileEntryResponse || {});
    resultMegazord.BalanceNanos = megazordStateless.BalanceNanos;
    // } else {
    //   resultMegazord.status_id = 2;
    //   resultMegazord.status_text = 'Pending Update Profile';
    // }
  } else {
    resultMegazord.status_id = 3;
    resultMegazord.status_text = 'Pending Public Key';
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
  // resultMegazord.Username = resultMegazord.Username || resultMegazord.PubKeyShort || 'Not Activated';
  if (resultMegazord.Username) {
    resultMegazord.link = 'https://bitclout.com/u/' + resultMegazord.Username;
  }
  if (resultMegazord.PublicKeyBase58Check) {
    resultMegazord.PubKeyShort = resultMegazord.PublicKeyBase58Check.slice(0, 12) + '...'
  }
  resultMegazord.Username = resultMegazord.Username || 'Anonymus';
  return resultMegazord;
}

export const api_functions = {
  'getTaskSession': () => {
    var path = window.location.href.split('/').pop();
    var task = path.split('&')[0].split('=')[1];
    return axios.post(apiEndpoint + '/getTaskSession', {data:{task}});
  },
  'task': data => {
    return new Promise(async (resolve, reject) => {
      var resp = await axios.post(apiEndpoint + '/task', {data});
      if (resp.data.error) {
        fireError('Task error: ' + resp.data.error);
        reject(resp.data.error);
        return
      }
      resolve(resp.data);
    })
  },
  'login': data => axios.post(apiEndpoint + '/login', {data}),
  'logout': () => {
    localStorage.setItem('users', null);
    auth.signOut();
  },
  'createMegazord': zords => {
    ///* forceRefresh */ true
    return new Promise((resolve, reject) => {
      axios.post(apiEndpoint + '/createMegazord', {data:{zords}}).then(resolve).catch(reject);
    })
  },
  'confirmMegazord': megazordId => {
    return new Promise((resolve, reject) => {
      axios.post(apiEndpoint + '/confirmMegazord', {data:{megazordId}}).then(resolve).catch(reject);
    })
  },
  'signInWithCustomToken': auth.signInWithCustomToken.bind(auth),
  'getBitcloutAcc': (publicKey, Username) => {
    return new Promise((resolve, reject) => {
      getBitcloutAcc(publicKey, Username).then(resolve).catch(e=>{
        // fireError('Get Bitclout Account ' + e);
        reject(e);
      })
    })
  },
  'getUserStateless': (publicKey) => {
    return new Promise((resolve, reject) => {
      getUserStateless(publicKey).then(resolve).catch(e=>{
        // fireError('Get Bitclout Account ' + e);
        reject(e);
      })
    })
  },
  'getAppState': () => {
    return new Promise((resolve, reject) => {
      axios.post(
        apiEndpoint + '/bitclout-proxy', {data:{action: 'get-app-state'}
      }).then(resp => {
        if (resp.data.error) {
          throw new Error(resp.data.error);
        }
        resolve(resp.data);
      }).catch((e) => {
        fireError('Get Bitclout App State ' + e);
        reject(e)
      })
    })
  },
  'getExchangeRate': () => {
    return new Promise((resolve, reject) => {
      getExchangeRate().then(resolve).catch(e=>{
        fireError('Get Bitclout Exchange Rate ' + e);
        reject(e);
      })
    })
  },
  'getBitcloutData': () => {
    return new Promise(async (resolve, reject) => {
      var res = {};
      try{
        res['exchangeRate'] = await api_functions.getExchangeRate();
        res['appState'] = await api_functions.getAppState();
      } catch(e) {
        reject(e);
      }
      resolve(res)
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
    userRef.off("value");
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
        db.ref("megazords/" + k).off('value');
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
    }, async e=>{
      console.log('EEE', e)
    })
  },
  'offUserData': () => {},
  'onError': (subscriber) => {
    onErrorSubscribers.push(subscriber);
  }
  // 'helloWorld': functions.httpsCallable('signIn')
}