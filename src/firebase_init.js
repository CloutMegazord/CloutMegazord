import firebase from "firebase";
import axios from "axios";

var config = {
  apiKey: "AIzaSyBG6Uo9bwEnxrVhDvxCnnGM88MfBgBm4EY",
  authDomain: "cloutmegazord.firebaseapp.com",
  databaseURL:
    "https://cloutmegazord-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cloutmegazord",
  storageBucket: "cloutmegazord.appspot.com",
  messagingSenderId: "493989806019",
  appId: "1:493989806019:web:05c697b2bfeb2f88a84776",
  measurementId: "G-NJHY4QC4FJ",
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

var apiEndpoint = "https://cloutmegazord.com/api";
var signingEndpoint = "https://signing-cloutmegazord.web.app";
if (window.location.hostname === "localhost") {
  apiEndpoint = "http://localhost:5000/api";
  signingEndpoint = "http://localhost:7000";
  db.useEmulator("localhost", 9000);
  storage.useEmulator("localhost",  9199);
  functions.useEmulator("localhost", 5001);
}
export const onErrorSubscribers = [];
const fireError = (e) => {
  onErrorSubscribers.forEach((func) => func(e));
};
const waitingMegazordAvatar = "/assets/img/waitingMegazord.png";
const defaultAvatar = "/assets/img/default_profile_pic.png";
const defaultUsername = "Anonymous";


function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function getImageOrFallback(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(true)
    img.onerror = () => {
      reject(`image not found for url ${url}`);
      img.onerror=null
      return false;
    }
  })
}

function getFromStorage(namespace, key) {
  var res = null;
  var item = localStorage.getItem(namespace);
  if (!item || item === "null" || !IsJsonString(item)) {
    localStorage.setItem(namespace, JSON.stringify({}));
    return null;
  }
  var namespaceObj = JSON.parse(localStorage.getItem(namespace));
  if (namespaceObj && key in namespaceObj) {
    if (Date.now() > namespaceObj[key].expired) {
      delete namespaceObj[key];
      localStorage.setItem(namespace, JSON.stringify(namespaceObj));
    } else {
      res = namespaceObj[key];
    }
  }
  return res;
}

var pubKeysBuffer = [];
var intervalId = null;
function registerBuffer(publicKey, callback) {
  pubKeysBuffer.push({ publicKey, callback });
  if (!intervalId) {
    intervalId = setTimeout(() => {
      axios
        .post(
          apiEndpoint + "/bitclout-proxy",
          {
            data: {
              action: "get-users-stateless",
              PublicKeysBase58Check: pubKeysBuffer.map((it) => it.publicKey),
              SkipHodlings: true,
            },
          },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data)
        .then((resp) => {
          if (resp.data.error) {
            pubKeysBuffer.forEach((item) => {
              item.callback(null, resp.data.error);
            });
            return;
          }
          pubKeysBuffer.forEach((item, index) => {
            item.callback(resp.data.UserList[index]);
          });
          pubKeysBuffer = [];
          intervalId = null;
        })
        .catch((err) => {
          pubKeysBuffer.forEach((item) => {
            item.callback(null, err);
          });
          pubKeysBuffer = [];
          intervalId = null;
        });
    }, 200);
  }
}

async function getUserStateless(publicKey) {
  return new Promise(function (resolve, reject) {
    registerBuffer(publicKey, function (data, error) {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

async function getBitcloutAcc(publicKey = "", Username = "") {
  var user =
    getFromStorage("users", publicKey) || getFromStorage("users", Username);
  if (user) {
    return user;
  }
  var respData = await axios
    .post(
      apiEndpoint + "/bitclout-proxy",
      {
        data: {
          action: "get-single-profile",
          PublicKeyBase58Check: publicKey,
          Username: Username,
        },
      },
      api_functions.getReqConfigs()
    )
    .then((resp) => resp.data);
  var Profile = respData.data.Profile;
  if (!Profile) {
    return null
  }
  Profile.id = Profile.PublicKeyBase58Check;
  Profile.PubKeyShort = Profile.PublicKeyBase58Check.slice(0, 12) + "...";
  Profile.ProfilePic = Profile.ProfilePic || defaultAvatar;

  var users = JSON.parse(localStorage.getItem("users"));
  users[Profile.id] = Profile;
  users[Profile.id].expired = Date.now() + 48 * 60 * 60 * 1000;
  users[Profile.Username] = users[Profile.id];
  localStorage.setItem("users", JSON.stringify(users));
  return Profile;
}

function getExchangeRate() {
  return new Promise(async function (resolve, reject) {
    var exchangeRate = getFromStorage("bitcloutData", "exchangeRate");
    if (exchangeRate) {
      resolve(exchangeRate);
      return;
    }
    try {
      var exRateResp = await axios
        .post(
          apiEndpoint + "/getExchangeRate",
          { data: {} },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data);
    } catch (e) {
      reject(e);
      return;
    }
    if (exRateResp.data.error) {
      reject(exRateResp.data.error);
      return;
    }

    var exchangeRate = exRateResp.data;
    var bitcloutData = JSON.parse(localStorage.getItem("bitcloutData"));
    exchangeRate.expired = Date.now() + 1 * 60 * 60 * 1000;
    var bitcloutData = JSON.parse(localStorage.getItem("bitcloutData"));
    bitcloutData.exchangeRate = exchangeRate;
    localStorage.setItem("bitcloutData", JSON.stringify(bitcloutData));
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
    color: megazordInfo.color,
    taskSessions: megazordInfo.taskSessions,
    tasks: [],
    UsersYouHODL: [],
    PublicKeyBase58Check: megazordInfo.PublicKeyBase58Check,
  };
  if (Object.keys(megazordInfo.pendingZords).length > 0) {
    resultMegazord.status_id = 1;
    resultMegazord.status_text = "Pending zords confirmation";
  } else if (resultMegazord.PublicKeyBase58Check) {
    var megazordStateless = await api_functions.getUserStateless(resultMegazord.PublicKeyBase58Check);
    if (!megazordStateless) {
      throw new Error('Get Megazord Error.');
    }
    resultMegazord.status_id = 0;
    resultMegazord.status_text = "Active";

    resultMegazord = Object.assign(
      resultMegazord,
      megazordStateless.ProfileEntryResponse || {}
    );
    resultMegazord.BalanceNanos = megazordStateless.BalanceNanos;
    resultMegazord.UsersYouHODL = megazordStateless.UsersYouHODL;
    if (megazordStateless.ProfileEntryResponse) {
      resultMegazord.founderRewardInput = (megazordStateless.ProfileEntryResponse.CoinEntry.CreatorBasisPoints / 100);
    }
  } else {
    resultMegazord.status_id = 3;
    resultMegazord.status_text = "Pending Public Key";
  }
  for (let k in megazordInfo.tasks || {}) {
    let task = megazordInfo.tasks[k];
    task.id = k;
    task.addedBy = await api_functions.getBitcloutAcc(task.addedBy);
    resultMegazord.tasks.push(task);
  }
  for (let k in {...megazordInfo.pendingZords, ...megazordInfo.confirmedZords}) {
    let isPending = k in megazordInfo.pendingZords;
    let cloutAccount = await api_functions.getBitcloutAcc(k);
    resultMegazord.canConfirm = resultMegazord.canConfirm || (isPending && k === user.id);
    resultMegazord.zords.push({
      PublicKeyBase58Check: k,
      avatar: cloutAccount.ProfilePic,
      status: isPending ? "pending" : "confirmed",
      name: cloutAccount.Username,
      link: "https://bitclout.com/u/" + cloutAccount.Username,
    });
  }
  // if (!resultMegazord.ProfilePic) {
  if (resultMegazord.PublicKeyBase58Check) {
    const picUrl = 'https://bitclout.com/api/v0/get-single-profile-picture/' + resultMegazord.PublicKeyBase58Check;
    try {
      await getImageOrFallback(picUrl).then();
      resultMegazord.ProfilePic = picUrl;
    } catch (e) {
      resultMegazord.ProfilePic = defaultAvatar;
    }
  } else {
    resultMegazord.ProfilePic = waitingMegazordAvatar;
  }
  // }
  // resultMegazord.Username = resultMegazord.Username || resultMegazord.PubKeyShort || 'Not Activated';
  if (resultMegazord.Username) {
    resultMegazord.link = "https://bitclout.com/u/" + resultMegazord.Username;
  }
  if (resultMegazord.PublicKeyBase58Check) {
    resultMegazord.PubKeyShort =
      resultMegazord.PublicKeyBase58Check.slice(0, 12) + "...";
  }
  resultMegazord.Username = resultMegazord.Username || defaultUsername;
  return resultMegazord;
}

export const api_functions = {
  defaultAvatar: defaultAvatar,
  defaultUsername: defaultUsername,
  getTaskSession: () => {
    var path = window.location.href.split("/").pop();
    var task = path.split("&")[0].split("=")[1];
    return axios
      .post(
        apiEndpoint + "/getTaskSession",
        { data: { task } },
        api_functions.getReqConfigs()
      )
      .then((resp) => resp.data);
  },
  task: (data) => {
    return new Promise(async (resolve, reject) => {
      var resp = await axios
        .post(apiEndpoint + "/task", { data }, api_functions.getReqConfigs())
        .then((resp) => resp.data);
      if (resp.data.error) {
        fireError("Task error: " + resp.data.error);
        reject(resp.data.error);
        return;
      }
      resolve(resp.data);
    });
  },
  login: (data) =>
    axios
      .post(apiEndpoint + "/login", { data }, api_functions.getReqConfigs())
      .then((resp) => resp.data),
  changeNotificationStatus: (data) =>
    axios
      .post(
        apiEndpoint + "/changeNotificationStatus",
        { data },
        api_functions.getReqConfigs()
      )
      .then((resp) => resp.data),
  logout: () => {
    localStorage.setItem("users", null);
    auth.signOut();
  },
  getFee: (AmountNanos, zords, CreatorPublicKeyBase58Check) => {
    return new Promise(async (resolve, reject) => {
      let resp = await axios.post(signingEndpoint + "/ts/getFee", {
        data: { AmountNanos, zords, CreatorPublicKeyBase58Check },
      });
      if (resp.data.error) {
        fireError("Task error: " + resp.data.error);
        reject(resp.data.error);
        return;
      }
      resolve(resp.data);
    });
  },
  loadFile: (name, file, metadata) => {
    return new Promise(async (resolve, reject) => {
      const task = storage.ref().child(name).put(file, metadata);
      task
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => resolve(url))
        .catch(reject);
    })
  },
  createMegazord: (zords) => {
    ///* forceRefresh */ true
    return new Promise(async (resolve, reject) => {
      var resp = await axios
        .post(
          apiEndpoint + "/createMegazord",
          { data: { zords } },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data);
      if (resp.data.error) {
        fireError("Task error: " + resp.data.error);
        reject(resp.data.error);
        return;
      }
      resolve(resp.data);
    });
  },
  confirmMegazord: (megazordId) => {
    return new Promise(async (resolve, reject) => {
      var resp = await axios
        .post(
          apiEndpoint + "/confirmMegazord",
          { data: { megazordId } },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data);
      if (resp.data.error) {
        fireError("Task error: " + resp.data.error);
        reject(resp.data.error);
        return;
      }
      resolve(resp.data);
    });
  },
  detachMegazord: (megazordId) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          apiEndpoint + "/detachMegazord",
          { data: { megazordId } },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data)
        .then(resolve)
        .catch(reject);
    });
  },
  hideMegazord: (megazordId, hide) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          apiEndpoint + "/hideMegazord",
          { data: { megazordId, hide } },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data)
        .then(resolve)
        .catch(reject);
    });
  },
  signInWithCustomToken: auth.signInWithCustomToken.bind(auth),
  getBitcloutAcc: (publicKey, Username) => {
    return new Promise((resolve, reject) => {
      getBitcloutAcc(publicKey, Username)
        .then(resolve)
        .catch((e) => {
          // fireError('Get Bitclout Account ' + e);
          reject(e);
        });
    });
  },
  getUserStateless: (publicKey) => {
    return new Promise((resolve, reject) => {
      getUserStateless(publicKey)
        .then(resolve)
        .catch((e) => {
          // fireError('Get Bitclout Account ' + e);
          reject(e);
        });
    });
  },
  getAppState: () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          apiEndpoint + "/bitclout-proxy",
          { data: { action: "get-app-state" } },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data)
        .then((resp) => {
          if (resp.data.error) {
            throw new Error(resp.data.error);
          }
          resolve(resp.data);
        })
        .catch((e) => {
          fireError("Get Bitclout App State " + e);
          reject(e);
        });
    });
  },
  getExchangeRate: () => {
    return new Promise((resolve, reject) => {
      getExchangeRate()
        .then(resolve)
        .catch((e) => {
          fireError("Get Bitclout Exchange Rate " + e);
          reject(e);
        });
    });
  },
  getBitcloutData: () => {
    return new Promise(async (resolve, reject) => {
      var res = {};
      try {
        res["exchangeRate"] = await api_functions.getExchangeRate();
        res["appState"] = await api_functions.getAppState();
      } catch (e) {
        reject(e);
      }
      resolve(res);
    });
  },
  getFeesMap: () => {
    return {
      1.5: 1 * 10**4,
      1: 1 * 10**5,
      0.5: Infinity
    };
  },
  onUserData: async (publicKey, callback, errorCallback = () => {}) => {
    var data,
      userRef = db.ref("users/" + publicKey);
    userRef.off("value");
    userRef.on(
      "value",
      async (snapshot) => {
        const userDBData = snapshot.val();
        if (!userDBData) {
          auth.signOut();
          return;
        }
        var userCloutData = await api_functions.getBitcloutAcc(publicKey);
        let resUser = Object.assign(userDBData, userCloutData);
        resUser.id = publicKey;
        resUser.settings = resUser.settings || { showHidden: false };
        resUser.megazordsIds = {};
        for (let k in resUser.megazords) {
          if (resUser.settings.showHidden) {
            resUser.megazordsIds[k] = true;
          } else if (!Object.keys(resUser.hiddenMegazords || {}).includes(k)) {
            resUser.megazordsIds[k] = true;
          }
        }
        delete resUser["megazords"];
        callback(resUser);
      },
      async (e) => {
        errorCallback(e);
        console.log("EEE", e);
      }
    );
  },
  onMegazordData: async (
    megazordId,
    user,
    callback,
    errorCallback = () => {}
  ) => {
    db.ref("megazords/" + megazordId).on(
      "value",
      async (snapshot) => {
        const megazordData = snapshot.val();
        var resMegazord;
        var id = snapshot.getRef().key;
        if (!megazordData) {
          db.ref("megazords/" + id).off("value");
          return;
        }
        megazordData.id = id;
        try {
          resMegazord = await handleMegazord(megazordData, user);
        } catch (e) {
          errorCallback(e);
          return;
        }
        callback(resMegazord);
      },
      (error) => {
        errorCallback(error);
      }
    );
  },
  offUserData: () => {},
  onError: (subscriber) => {
    onErrorSubscribers.push(subscriber);
  },
  authToken: null,
  getReqConfigs: () => {
    var configs = {};
    if (api_functions.authToken) {
      configs.headers = { Authorization: `Bearer ${api_functions.authToken}` };
    }
    return configs;
  },
  saveSettings: (settings) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          apiEndpoint + "/saveSettings",
          { data: { settings } },
          api_functions.getReqConfigs()
        )
        .then((resp) => resp.data)
        .then(resolve)
        .catch(reject);
    });
  },
  // 'helloWorld': functions.httpsCallable('signIn')
};
