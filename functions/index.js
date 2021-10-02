"use strict";
const KeyEncoder = require("key-encoder").default;
const EC = require("elliptic").ec;
const crypto = require("crypto");
const axios = require("axios");
const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const Tasks = require("./tasks").Tasks;
const helmet = require("helmet");
const sanitizer = require("sanitizer");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bs58check = require("bs58check");
const notifications = require("./notifications");
const config = require("./config");
var url = require("url");
var path = require("path");

let signingEndpoint, CMEndpoint;
const FeesMap = {
    1.5: 1 * 10**4,
    1: 1 * 10**5,
    0.5: Infinity
}

const CloutMegazordPubKey = config.get("mgzPubKey");
const bitcloutCahceExpire = {
  "get-exchange-rate": 10 * 60 * 1000,
  ticker: 10 * 60 * 1000,
  "get-single-profile": 48 * 60 * 60 * 1000,
  "get-app-state": 24 * 60 * 60 * 1000,
};
const taskSessionsExpire = 10 * 60 * 1000;
if (process.env.NODE_ENV === "development") {
  // process.env.GOOGLE_APPLICATION_CREDENTIALS = config.get("firebase");
}
admin.initializeApp();
const db = admin.database();
const auth = admin.auth();
const storage = admin.storage();

if (process.env.NODE_ENV === "development") {
  db.useEmulator("localhost", 9000);
  CMEndpoint = "http://localhost:3000";
  signingEndpoint = "http://localhost:7000";
} else {
  signingEndpoint = "https://signing-cloutmegazord.web.app";
  CMEndpoint = "https://cloutmegazord.com";
}

const app = express();
// Automatically allow cross-origin requests
const whitelist = [
  "https://us-central1-cloutmegazord.cloudfunctions.net",
  CMEndpoint,
  signingEndpoint,
  "https://bogdandidenko.github.io",
  "http://localhost:3000",
  "http://localhost:5001",
  "http://localhost:5000"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(helmet());
app.use(express.json({ limit: "100kb" }));

function expireCleaner(ref) {
  ref.orderByChild("expire").once("value", async function (s) {
    if (!s.val()) {
      return;
    }
    const items = s.val();
    for (let key in items) {
      let item = items[key];
      if (Date.now() > item.expire) {
        s.ref.child(key).remove();
      }
    }
  });
}

setInterval(() => {
  expireCleaner(db.ref("bitcloutCache"));
}, 10 * 60 * 1000);

setInterval(async () => {
  const megazordsSnap = await db.ref("megazords").get();
  if (megazordsSnap.exists()) {
    var megazords = megazordsSnap.val();
  }
  for (let megazordId in megazords) {
    let megazord = megazords[megazordId];
    for (let taskid in megazord.tasks || {}) {
      let task = megazord.tasks[taskid];
      if (
        task.taskSessionRun &&
        task.taskSessionRun + taskSessionsExpire < Date.now()
      ) {
        db.ref(
          "megazords/" + megazordId + "/tasks/" + taskid + "/taskSessionRun"
        ).remove();
      }
    }
  }
}, 60 * 10 * 1000);

function getReqData(req, field) {
  let data = req.body.data[field];
  let sanitData = sanitizer.sanitize(req.body.data[field]);
  if (data !== sanitData) {
    throw new Error("Unsafety data.");
  }
  return sanitData;
}

const getFeePercentage = async (zords, task) => {
  let customFees;
  var trgFee;
  let customFeesSnap = await db.ref('customFees').get();
  if (customFeesSnap.exists()) {
      customFees = customFeesSnap.val();
  } else {
      customFees = {};
  }
  for (let zord of zords) {
      if (customFees[zord] !== undefined) {
          if (trgFee === undefined) {
              trgFee = customFees[zord];
          } else {
              trgFee = (trgFee < customFees[zord]) ? trgFee : customFees[zord];
          }
      }
  }
  if (trgFee === undefined) {
    let AmountUSD;
    const exchRate = await getExchangeRate();
    if (task.CreatorPublicKeyBase58Check) {
        let userResp = await bitcloutProxy({
            action: 'get-users-stateless',
            PublicKeysBase58Check: [task.CreatorPublicKeyBase58Check],
            SkipForLeaderboard: true
        });
        let CoinPriceBitCloutNanos = userResp.UserList[0].ProfileEntryResponse.CoinPriceBitCloutNanos;
        AmountUSD = (task.AmountNanos / 1e9) * (CoinPriceBitCloutNanos / 1e9 ) * exchRate.USDbyBTCLT;
    } else {
        AmountUSD = task.AmountNanos / 1e9 * exchRate.USDbyBTCLT;
    }
    var fees = Object.keys(FeesMap).sort().reverse();
    trgFee = fees[0];
    for (let fee of fees) {
      let range = FeesMap[fee];
      if (AmountUSD < range) {
          trgFee = parseFloat(fee);
          break
      }
    }
  }

  return trgFee;
}

const validatePublicKey = (jwt_token, publicKey) => {
  const keyEncoder = new KeyEncoder("secp256k1");
  const ec = new EC("secp256k1");
  try {
    var pubKeyBytes = bs58check.decode(publicKey);
    const pubKeyBytesArray = [...pubKeyBytes];
    pubKeyBytesArray.splice(0, 3);
    const rawPubKeyHex = ec
      .keyFromPublic(pubKeyBytesArray, "hex")
      .getPublic()
      .encode("hex", true);
    const rawPubKeyHexEncoded = keyEncoder.encodePublic(
      rawPubKeyHex,
      "raw",
      "pem"
    );
    const decoded = jwt.verify(jwt_token, rawPubKeyHexEncoded, {
      algorithms: ["ES256"],
    });
    return [true, decoded];
  } catch (err) {
    return [false, err];
  }
};

async function bitcloutProxy(data) {
  return new Promise(async (resolve, reject) => {
    const action = data["action"];
    const method = data["method"] || "post";
    var cachedData = null;
    delete data["action"];
    delete data["method"];
    if (bitcloutCahceExpire[action]) {
      const cachedDataRef = await db
        .ref("bitcloutCache")
        .child(JSON.stringify({ [method]: data }))
        .get();
      if (cachedDataRef.exists()) {
        console.log("Cache Hit");
        cachedData = cachedDataRef.val();
        resolve(cachedData.data);
        return
      }
    }
    axios[method]("https://bitclout.com/api/v0/" + action, data, {
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        if (action === "get-single-profile") {
          resp.data.Profile.ProfilePic =
            "https://bitclout.com/api/v0/get-single-profile-picture/" +
            resp.data.Profile.PublicKeyBase58Check;
        }
        if (bitcloutCahceExpire[action]) {
          db.ref("bitcloutCache")
            .child(JSON.stringify({ [method]: data }))
            .set({
              data: resp.data,
              expire: Date.now() + bitcloutCahceExpire[action],
            });
        }
        resolve(resp.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function getUser(userId) {
  var user = null,
    snapshot;
  snapshot = await db.ref().child("users").child(userId).get();
  if (snapshot.exists()) {
    user = snapshot.val();
  }
  return user;
}

async function addUser(userId) {
  const userRef = db.ref("users");
  const megazordsRef = db.ref("megazords");
  await new Promise((resolve, reject) => {
    megazordsRef
      .orderByChild("pendingZords/" + userId)
      .equalTo(true)
      .once(
        "value",
        async function (s) {
          var pendingZords = s.val() || {};
          pendingZords = Object.keys(pendingZords).reduce((prev, curr) => {
            prev[curr] = true;
            return prev;
          }, {});
          await userRef.child(userId).set({
            createTime: Date.now(),
            megazords: pendingZords,
          });
          if (Object.keys(pendingZords).length) {
            userRef
              .child(userId)
              .child("notifications")
              .push(notifications("newMegazord", {}));
          }
          resolve();
        },
        function (error) {
          reject();
        }
      );
  });

  await userRef
    .child(userId)
    .child("notifications")
    .push(notifications("welcome", {}));
}

async function addMegazord(zords, owner) {
  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const megazordsRef = db.ref("megazords");
  var newMegazordRef = await megazordsRef.push({
    color: getRandomColor(),
    confirmedZords: { [owner]: true },
    pendingZords: zords.reduce((prev, curr, i) => {
      prev[curr] = true;
      return prev;
    }, {}),
  });
  await db
    .ref("users/" + owner)
    .child("megazords")
    .child(newMegazordRef.key)
    .set(true);
  for (const zord of zords) {
    let user = await getUser(zord);
    if (!user) {
      continue;
    }
    var userRef = db.ref("users/" + zord);
    var userMegazordsRef = userRef.child("megazords");
    await userMegazordsRef.child(newMegazordRef.key).set(true);
    await userRef.child("notifications").push(notifications("newMegazord", {}));
  }
}

async function deleteTask(megazordId, taskId) {
  const megazordRef = db.ref("megazords/" + megazordId);
  let taskSnap = await megazordRef.child("tasks").child(taskId).get();
  if (!taskSnap.exists()) {
    return
  }
  let task = taskSnap.val();
  if (task.type === 'updateProfile') {
    if (task.NewProfilePic) {
      var parsed = url.parse(task.NewProfilePic);
      await storage.bucket().file(path.basename(parsed.pathname)).delete();
    }
  }
  await megazordRef.child("tasks").child(taskId).remove();
}

async function getExchangeRate() {
  try {
    var exchangeRate = await bitcloutProxy({method: 'get', action: 'get-exchange-rate'});
  } catch (e) {
    throw new Error(e);
  }
  var exchangeRate =  {
    SatoshisPerBitCloutExchangeRate: exchangeRate.SatoshisPerBitCloutExchangeRate,
    USDCentsPerBitcoinExchangeRate: exchangeRate.USDCentsPerBitcoinExchangeRate,
    USDbyBTCLT: exchangeRate.USDCentsPerBitCloutExchangeRate / 100
  }
  return exchangeRate;
}

async function getSingleProfile(data) {
  var data = req.body.data;
  try {
    let result = await bitcloutProxy(data);
    result;
    res.send({ data: result });
  } catch (error) {
    res.send({ data: { error: error.toString() } });
  }
}

async function getTaskSessionLink(publicKey, taskId) {
  var dbTaskSession = null;
  const dbTaskSessionRef = db.ref("taskSessions/" + taskId);
  var dbTaskSessionSnap = await dbTaskSessionRef.get();
  if (dbTaskSessionSnap.exists()) {
    dbTaskSession = dbTaskSessionSnap.val();
    let initiatorSid = dbTaskSession.zsids[publicKey];
    return `${signingEndpoint}/ts/get?sid=${dbTaskSession.sessionId}&zsid=${initiatorSid}`;
  }
  return null;
}

const Validation = {
  async checkOnMegazordsCountError(publicKey) {
    var allowlist = await db.ref("allowlist").get();
    if (allowlist.exists()) {
      if (Object.keys(allowlist.val()).includes(publicKey)) {
        return false;
      }
    }
    let currentMegazordsCount = 0;
    let userMegazordsSnap = await db
      .ref("users/" + publicKey + "/megazords")
      .get();
    if (userMegazordsSnap.exists()) {
      let userMegazords = userMegazordsSnap.val();
      for (let mID in userMegazords) {
        let confirmedZordsSnap = await db
          .ref("megazords/" + mID + "/confirmedZords")
          .get();
        if (confirmedZordsSnap.val()[publicKey]) {
          currentMegazordsCount += 1;
        }
      }
    }
    if (currentMegazordsCount > 1) {
      return "You can't create more than 2 Megazords. Detach first.";
    }
  },
};

app.post("/api/bitclout-proxy", async (req, res, next) => {
  var data = req.body.data;
  try {
    let result = await bitcloutProxy(data);
    res.send({ data: result });
  } catch (error) {
    res.send({ data: { error: error.toString() } });
  }
});

app.post("/api/getExchangeRate", async (req, res, next) => {
  try {
    var exchangeRate = await getExchangeRate();
  } catch (e) {
    res.send({ data: { error: e.toString() } });
    return;
  }
  res.send({ data: exchangeRate });
});

app.post("/api/getSingleProfile", async (req, res, next) => {
  try {
    var exchangeRate = await getSingleProfile();
  } catch (e) {
    res.send({ data: { error: e.toString() } });
    return;
  }
  res.send({ data: exchangeRate });
});

app.post("/api/login", async (req, res, next) => {
  var user = null;
  const jwt_token = req.body.data["jwt"];
  const publicKey = req.body.data["publicKey"];
  const [isValid, _] = validatePublicKey(jwt_token, publicKey);
  if (!isValid) {
    res.send({ data: { error: "BitClout Validation Error." } });
    return;
  }
  // var allowlist = await db.ref('allowlist').get();
  // if (allowlist.exists()) {
  //     if (!Object.keys(allowlist.val()).includes(publicKey)) {
  //         res.send({data: { error: "You don't allowlisted to participate in closed beta. Send message to @CloutMegazord"}});
  //         return
  //     }
  // }
  try {
    user = await getUser(publicKey);
    if (!user) {
      await addUser(publicKey);
      user = await getUser(publicKey);
      if (!user) {
        res.send({ data: { error: "Firebase Save User Error." } });
        return;
      }
    }
    const customToken = await auth.createCustomToken(publicKey);
    res.status(200).send({ data: { token: customToken } });
  } catch (err) {
    console.error(err);
    res.send({ data: { error: "Firebase Error." } });
    return;
  }
});

app.post("/api/hideMegazord", async (req, res, next) => {
  var data = req.body.data;
  const megazordId = data.megazordId;
  const hide = data.hide;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  var publicKey;
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  if (hide) {
    await db
      .ref("users/" + publicKey + "/hiddenMegazords/" + megazordId)
      .set(hide);
  } else {
    await db
      .ref("users/" + publicKey + "/hiddenMegazords/" + megazordId)
      .remove();
  }
  // await megazordRef.update({hidden: hide})
  res.send({ data: { ok: true } });
});

app.post("/api/saveSettings", async (req, res, next) => {
  var data = req.body.data;
  const megazordId = data.megazordId;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  var publicKey;
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  await db.ref("users/" + publicKey + "/settings").set({
    showHidden: !!data.settings.showHidden,
  });
  res.send({ data: { ok: true } });
});

app.post("/api/detachMegazord", async (req, res, next) => {
  var data = req.body.data;
  const megazordId = data.megazordId;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  var publicKey;
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  const megazordRef = db.ref("megazords/" + megazordId);
  var megazorSnap = await megazordRef.get();
  if (megazorSnap.exists()) {
    var megazord = megazorSnap.val();
  } else {
    res.send({ data: { error: "Megazord not found." } });
    return;
  }
  if (megazord.confirmedZords[publicKey]) {
    delete megazord.confirmedZords[publicKey];
  } else {
    res.send({ data: { error: "You can't detach this Megazord." } });
    return;
  }
  if (!megazord.pendingZords) {
    megazord.pendingZords = {};
    megazord.tasks = [];
    megazord.PublicKeyBase58Check = "";
  }
  megazord.pendingZords[publicKey] = true;
  try {
    if (Object.keys(megazord.confirmedZords).length) {
      await megazordRef.update(megazord);
    } else {
      for (let zordK in megazord.pendingZords) {
        await db
          .ref("users/" + zordK + "/megazords")
          .child(megazordId)
          .remove();
      }
      await megazordRef.remove();
    }
  } catch (e) {
    res.send({ data: { error: e.toString() } });
    return;
  }
  res.send({ data: { success: true } });
});

app.post("/api/confirmMegazord", async (req, res, next) => {
  var data = req.body.data;
  const megazordId = data.megazordId;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  var publicKey;
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  let valError = await Validation.checkOnMegazordsCountError(publicKey);
  if (valError) {
    res.send({ data: { error: valError } });
    return;
  }
  const megazordRef = db.ref("megazords/" + megazordId);
  var megazorSnap = await megazordRef.get();
  if (megazorSnap.exists()) {
    var megazord = megazorSnap.val();
  } else {
    res.send({ data: { error: "Megazord not found." } });
    return;
  }
  if (publicKey in megazord.pendingZords) {
    delete megazord.pendingZords[publicKey];
  } else {
    res.send({ data: { error: "You already confirmerd this task." } });
    return;
  }
  megazord.confirmedZords[publicKey] = true;
  try {
    await megazordRef.update(megazord);
  } catch (e) {
    res.send({ data: { error: e.toString() } });
    return;
  }
  if (Object.keys(megazord.pendingZords).length === 0) {
    var task = Tasks.createTask({
      type: "getPublicKey",
      addedBy: CloutMegazordPubKey,
      Recipient: "TargetMegazord"
    });
  }
  await megazordRef.child("tasks").push(task.toDBRecord());
  res.send({ data: { success: true } });
});

app.post("/api/createMegazord", async (req, res, next) => {
  var data = req.body.data;
  var zordsList = [];
  var publicKey;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  let valError = await Validation.checkOnMegazordsCountError(publicKey);
  if (valError) {
    res.send({ data: { error: valError } });
    return;
  }
  zordsList = data.zords;
  var isValid = zordsList.length + 1 < 5;
  //All Id are unique
  isValid =
    isValid &&
    [...new Set([publicKey].concat(zordsList))].length ===
      [publicKey].concat(zordsList).length;
  if (!isValid) {
    res.send({ data: { error: "Zords data invalid." } });
    return;
  }
  for (let i = 0; i < zordsList.length; i += 1) {
    let zord = zordsList[i];
    try {
      let profile = await bitcloutProxy({
        action: "get-single-profile",
        PublicKeyBase58Check: zord,
        Username: "",
      });
      if (!profile.Profile.Username) {
        throw new Error("Incorret zord publicKey");
      }
    } catch (error) {
      res.send({ data: { error: error.message } });
      return;
    }
  }
  await addMegazord(zordsList, publicKey);
  res.send({ data: {} });
});

app.post("/api/finishTask", async (req, res, next) => {
  const { task, taskData, taskError } = req.body.data;
  const megazordRef = db.ref("megazords/" + taskData.megazordId);
  if (!taskError) {
    if (task.type === "getPublicKey") {
      megazordRef.child("PublicKeyBase58Check").set(taskData.megazordPublicKey);
    }
    await deleteTask(taskData.megazordId, task.id);
  } else {
    await megazordRef.child("tasks/" + task.id + "/taskSessionRun").remove();
  }
  var megazorSnap = await megazordRef.get();
  var megazord = megazorSnap.val();
  var notificationType = taskError ? "taskFailed" : "taskDone";
  for (let zord in megazord.confirmedZords) {
    await db
      .ref("users/" + zord)
      .child("notifications")
      .push(
        notifications(notificationType, {
          taskType: task.type,
          error: taskError,
        })
      );
  }
  res.send({ ok: true });
});

app.post("/api/changeNotificationStatus", async (req, res, next) => {
  const { notificationId, notificationStatus } = req.body.data;
  const userRef = db.ref("users");
  let publicKey;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  try {
    await userRef
      .child(publicKey)
      .child("notifications")
      .child(notificationId)
      .update({ status: notificationStatus });
    res.send({ data: { ok: true } });
  } catch (err) {
    res.send({ data: { error: err.message } });
  }
});

app.post("/api/getTaskSessionLink", async (req, res, next) => {
  var data = req.body.data;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  var publicKey;
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  const taskLink = await getTaskSessionLink(publicKey, data.taskId);
  res.send({data: {taskLink: taskLink}});
});


app.post("/api/task", async (req, res, next) => {
  var data = req.body.data;
  var publicKey;
  var task;
  var customToken = req.headers.authorization.replace("Bearer ", "");
  try {
    let verif = await auth.verifyIdToken(customToken);
    publicKey = verif.uid;
  } catch (error) {
    res.send({ data: { error: error.message } });
    return;
  }
  const megazordRef = db.ref("megazords/" + data.megazordId);
  var megazorSnap = await megazordRef.get();
  if (megazorSnap.exists()) {
    var megazord = megazorSnap.val();
  } else {
    res.send({ data: { error: "Megazord not Found" } });
    return
  }
  switch (data.action) {
    case "create":
      task = Tasks.createTask({
        ...data.task,
        addedBy: publicKey,
        megazorSnap: megazorSnap,
      });

      await megazordRef.child("tasks").push(task.toDBRecord());
      res.send({ data: {} });
      break;
    case "delete":
      await deleteTask(data.megazordId, data.task.id);
      // await megazordRef.child("tasks/" + data.task.id).remove();
      res.send({ data: {} });
      break;
    case "powerOn":
      var taskId = data.task.id;
      var dbTask = megazord.tasks[data.task.id];
      const taskLink = await getTaskSessionLink(publicKey, taskId);
      if (taskLink) {
        res.send({data: {taskLink: taskLink}});
        return;
      }
      var taskSession = {
        initiator: { PublicKeyBase58Check: publicKey },
        megazordId: data.megazordId,
        task: dbTask,
        taskId: taskId,
        readyZordsShrtIds: [],
        redirect: CMEndpoint + "/admin/megazordslist",
        zords: [],
        trgFee: null,
        startTime: Date.now()
      };
      if (megazord.PublicKeyBase58Check) {
        taskSession.megazordPublicKeyBase58Check = megazord.PublicKeyBase58Check;
      }
      var zords = megazord.confirmedZords;
      var zsids = {}
      for (let zordPublicKey in zords) {
        zsids[zordPublicKey] = crypto.randomBytes(8).toString("hex");
        try {
          var profileRes = await bitcloutProxy({
            action: "get-single-profile",
            PublicKeyBase58Check: zordPublicKey,
            Username: "",
          });
        } catch (err) {
          res.send({ data: { error: err.toString() } });
          return;
        }
        taskSession.zords.push({
          PubKeyShort: zordPublicKey.slice(0, 14) + "...",
          PublicKeyBase58Check: zordPublicKey,
          Username: profileRes.Profile.Username,
          ProfilePic: profileRes.Profile.ProfilePic,
          link: CMEndpoint + `/tsr?tid=${taskId}&zid=${zordPublicKey}`
        });
        if (zordPublicKey === publicKey) {
          taskSession.initiator.PublicKeyBase58Check = publicKey;
        }
      }

      if (dbTask.type === 'send') {
        taskSession.trgFee = await getFeePercentage(Object.keys(zords), dbTask);
      }
      try {
        var resp = await axios.post(signingEndpoint + "/ts/create", {
          data: { taskSession, zsids },
        });
      } catch (e) {
        res.send({ data: { error: "signing connection error." } });
        return;
      }
      await db.ref("taskSessions").child(taskId).set({
        startTime: taskSession.startTime,
        zsids: zsids,
        sessionId: sessionId
      });
      let initiatorSid = zsids[taskSession.initiator.PublicKeyBase58Check];
      res.send({data: {taskLink:`${signingEndpoint}/ts/get?sid=${resp.sessionId}&zsid=${initiatorSid}`}});
      break;
  }
});

exports.api = functions.https.onRequest(app);

// exports.shortener = functions.https.onRequest(async (req, res) => {
//   var subNamesMap = { t: "tasks" };
//   var pathSplit = req.path.split("/");
//   var subName = subNamesMap[pathSplit[2]];
//   var shrtLink = pathSplit.pop();
//   var snapshot = await db
//     .ref("shortener/" + subName)
//     .child(shrtLink)
//     .get();
//   if (snapshot.exists()) {
//     var link = snapshot.val().link;
//   } else {
//     res.status(404).send("Page Not Flound");
//   }
//   res.writeHead(302, {
//     Location: link,
//     //add other headers here...
//   });
//   res.end();
// });
