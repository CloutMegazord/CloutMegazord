'use strict'
var KeyEncoder = require('key-encoder').default;
const EC = require('elliptic').ec;
const crypto = require('crypto');
const axios = require('axios');
const functions = require("firebase-functions");
const cors = require('cors');
const express = require('express');
const adapters = require('./api_adapters').adapters;
const Tasks = require('./tasks').Tasks;
const BitcloiutApi = require('./bitclout_api').BitcloiutApi
const helmet = require("helmet");
const sanitizer = require('sanitizer');
const rimraf = require("rimraf");
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
const bs58check = require('bs58check');
const bip39 = require('bip39');
const mkdirp = require('mkdirp')
const path = require('path');
const CryptoService = require('./bitclout/crypto.service').CryptoService;
const EntropyService = require('./bitclout/entropy.service').EntropyService;

const notifications = require('./notifications');
const {existsSync, readdir, promises: {readFile, readFiles, writeFile, mkdir}} = require("fs");

admin.initializeApp();
const db = admin.database();
const auth = admin.auth()
db.useEmulator("localhost", 9000)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// "adminContent": {
//     ".read": "auth.uid === 'some-uid'"
//   }
// const megazord_seed = require('../dev_data/megazord.json').seed;
const adapterName = 'puppeteer_adapter'//will get from env
const bitcloiutApi = new BitcloiutApi(new adapters[adapterName]())
const cryptoService = new CryptoService();
const entropyService = new EntropyService();
const app = express();

app.use(helmet());
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json({limit:'100kb'}))


const CloutMegazordPubKey = 'BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE';
const taskSessionsExpire = (10 * 60 * 10**3);//10 mins
const bitcloutCahceExpire = {
    'get-exchange-rate': 2 * 60 * 1000,
    'ticker': 2 * 60 * 1000,
    'get-single-profile': 24 * 60 * 60 * 1000,
    'get-app-state':  24 * 60 * 60 * 1000
}

const tskSessFold = __dirname + '/tmp/taskSessions/';
const functionsUrl = 'http://localhost:5001/cloutmegazord/us-central1/';

function expireCleaner(ref) {
    ref.orderByChild('expire').once('value', async function(s) {
        if (!s.val()) {return}
        const items = s.val();
        for (let key in items) {
            let item = items[key];
            if (Date.now() > item.expire) {
                s.ref.child(key).remove();
            }
        }
    })
}

setInterval(() => {
    expireCleaner(db.ref('protected/encryptedSeeds'));
    expireCleaner(db.ref('taskSessions'));
    expireCleaner(db.ref('bitcloutCache'));
}, 2 * 60 * 1000)

function getReqData(req, field) {
    let data = req.body.data[field];
    let sanitData = sanitizer.sanitize(req.body.data[field]);
    if (data !== sanitData) {
        throw new Error('Unsafety data.');
    }
    return sanitData;
}


const validatePublicKey = (jwt_token, publicKey) => {
    const keyEncoder = new KeyEncoder('secp256k1');
    const ec = new EC('secp256k1');
    try {
        var pubKeyBytes = bs58check.decode(publicKey);
        const pubKeyBytesArray = [...pubKeyBytes];
        pubKeyBytesArray.splice(0, 3);
        const rawPubKeyHex = ec.keyFromPublic(pubKeyBytesArray, 'hex')
            .getPublic()
            .encode('hex', true);
        const rawPubKeyHexEncoded = keyEncoder.encodePublic(rawPubKeyHex, 'raw', 'pem');
        const decoded = jwt.verify(jwt_token, rawPubKeyHexEncoded, {algorithms: ['ES256']});
        return [true, decoded];
    } catch(err) {
        return [false, err];
    }
}

async function bitcloutProxy(data) {
    return new Promise(async (resolve, reject) => {
        const action = data['action'];
        const method = data['method'] || 'post';
        var cachedData  = null;
        delete data['action']
        delete data['method']
        const cachedDataRef = await db.ref('bitcloutCache').child(JSON.stringify(data)).get();
        if (cachedDataRef.exists()) {
            console.log('Cache Hit')
            cachedData = cachedDataRef.val();
            resolve(cachedData.data);
        }
        axios[method]("https://bitclout.com/api/v0/" + action,
            data,
            {headers: {'Content-Type': 'application/json'}
        }).then(resp => {
            db.ref('bitcloutCache').child(JSON.stringify({method:data})).set({
                data: resp.data, expire: Date.now() + bitcloutCahceExpire[action]
            })
            resolve(resp.data)
        }).catch(error => {
            reject(error)
        });
    })
}

async function getUser(userId) {
    var user = null, snapshot;
    snapshot = await db.ref().child("users").child(userId).get();
    if (snapshot.exists()) {
        user = snapshot.val();
    }
    return user
}

async function addUser(userId) {
    const userRef = db.ref('users');
    const megazordsRef = db.ref('megazords');
    await new Promise((resolve, reject) => {
        megazordsRef.orderByChild('pendingZords/' + userId).equalTo(true).once('value', async function(s) {
            var pendingZords = s.val() || {};
            pendingZords = Object.keys(pendingZords).reduce((prev, curr) => {
                prev[curr] = true;
                return prev;
            }, {});
            await userRef.child(userId).set({
                createTime: Date.now(),
                megazords: pendingZords
              });
            if (Object.keys(pendingZords).length) {
                userRef.child(userId).child('notifications').push(notifications('newMegazord', {}))
            }
            resolve();
        }, function(error) {
            reject();
        })
    })

    await userRef.child(userId).child('notifications').push(notifications('welcome', {}))
}

async function addMegazord(zords, owner) {
    const megazordsRef = db.ref('megazords');
    var newMegazordRef = await megazordsRef.push({
        confirmedZords: {[owner]: true},
        pendingZords: zords.reduce((prev, curr, i) => {
            prev[curr] = true;
            return prev;
        }, {})
    });
    await db.ref('users/' + owner).child('megazords').child(newMegazordRef.key).set(true);
    for (const zord of zords) {
        let user = await getUser(zord);
        if (!user) {continue;}
        var userRef = db.ref('users/' + zord)
        var userMegazordsRef = userRef.child('megazords')
        await userMegazordsRef.child(newMegazordRef.key).set(true);
        await userRef.child('notifications').push(notifications('newMegazord', {}))
    }
}

async function getExchangeRate() {
    try {
        var exchangeRate = await bitcloutProxy({method: 'get', action: 'get-exchange-rate'});
        var tickerResp = await axios.get('https://blockchain.info/ticker');
      } catch (e) {
        throw new Error(e);
      }

      if (tickerResp.data.error) {
        reject(tickerResp.data.error);
      }
      var ticker = tickerResp.data;
      // var exchangeRate =  (ticker.USD.last / 100) * (exchangeRate.SatoshisPerBitCloutExchangeRate / 100000000)
      var exchangeRate =  {
        SatoshisPerBitCloutExchangeRate: exchangeRate.SatoshisPerBitCloutExchangeRate,
        USDCentsPerBitcoinExchangeRate: ticker.USD.last,
        USDbyBTCLT: ticker.USD.last * (exchangeRate.SatoshisPerBitCloutExchangeRate / 100000000)
      }
      return exchangeRate;
}

app.post('/bitclout-proxy', async (req, res, next) => {
    var data = req.body.data;
    try {
        let result = await bitcloutProxy(data);
        res.send({data: result})
    } catch(error) {
        res.send({data: { error: error.toString()}})
    }
});

app.post('/getExchangeRate', async (req, res, next) => {
    try {
        var exchangeRate = await getExchangeRate();
      } catch (e) {
        res.send({data:{ error: e.toString()}});
        return
      }
      res.send({data:exchangeRate});
});

app.post('/login', async (req, res, next) => {
    var user = null;
    const jwt_token = req.body.data['jwt'];
    const publicKey = req.body.data['publicKey'];
    const [isValid, _] = validatePublicKey(jwt_token, publicKey)
    if (!isValid) {
        res.send({data:{ error: 'BitClout Validation Error.'}});
        return;
    }
    try {
        user = await getUser(publicKey);
        if (!user) {
            await addUser(publicKey);
            user = await getUser(publicKey);
            if (!user) {
                res.send({data: { error: 'Firebase Save User Error.'}});
                return
            }
        }
        const customToken = await auth.createCustomToken(publicKey);
        res.status(200).send({data: {"token": customToken}});
    } catch(err) {
        res.send({data:{error: 'Firebase Error.'}})
        return;
    }
})

app.post('/confirmMegazord', async (req, res, next) => {
    var data = req.body.data;
    const megazordId = data.megazordId;
    var customToken = req.headers.authorization.replace('Bearer ', '');
    var publicKey;
    try {
        let verif = await auth.verifyIdToken(customToken);
        publicKey = verif.uid;
    } catch(error) {
        res.send({data:{error: error.message}})
        return
    }
    const megazordRef = db.ref('megazords/' + megazordId);
    var megazorSnap = await megazordRef.get()
    if (megazorSnap.exists()) {
        var megazord = megazorSnap.val();
    } else {
        res.send({data:{error: "Megazord not found."}})
        return
    }
    if (publicKey in megazord.pendingZords) {
        delete megazord.pendingZords[publicKey];
    } else {
        res.send({data:{error: 'You already confirmerd this task.'}})
    }
    megazord.confirmedZords[publicKey] = true;

    await megazordRef.set(megazord)
    const task = Tasks.createTask({
        type: 'getPublicKey',
        addedBy: CloutMegazordPubKey,
        megazorSnap: megazorSnap,
        Recipient: 'TargetMegazord'
    });
    console.log(task.toDBRecord())
    await megazordRef.child('tasks').push(task.toDBRecord());

    // await megazordRef.child('pendingZords').child(publicKey).remove()
    // await megazordRef.child('confirmedZords').child(publicKey).set(true);
    res.send({data:{success: true}})
});

app.post('/createMegazord', async (req, res, next) => {
    var data = req.body.data;
    var zordsList = [];
    var publicKey;
    var customToken = req.headers.authorization.replace('Bearer ', '');
    try {
        let verif = await auth.verifyIdToken(customToken);
        publicKey = verif.uid;
    } catch(error) {
        res.send({data:{error: error.message}})
        return
    }
    zordsList = data.zords;
    var isValid = (zordsList.length + 1) < 5;
    //All Id are unique
    isValid = isValid && ([...new Set([publicKey].concat(zordsList))].length === [publicKey].concat(zordsList).length)
    if (!isValid) {
        res.send({data:{error: 'Zords data invalid.'}})
        return
    }
    for (let i = 0; i < zordsList.length; i += 1) {
        let zord = zordsList[i];
        try {
            let profile = await bitcloutProxy({
                action: 'get-single-profile',
                PublicKeyBase58Check: zord,
                Username: ''
            });
            if (!profile.Profile.Username) {
                throw new Error('Incorret zord publicKey')
            }
        } catch(error) {
            res.send({data:{error: error.message}})
            return
        }
    }
    await addMegazord(zordsList, publicKey);
    res.send({data:{}})
})

async function testTask() {
    var task = Tasks.createTask({
        addedBy:'BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE',
        AmountNanos:'1000000000',
        Recipient:'BC1YLj8LTffNBmCnrmGCgEG9y5upH14a9cnCrqw5ipC7sgEMi3TxgLa',
        Currency:'$BitClouts',
        megazorSnap:{
            key: '-Map4bNttVTay3mSQalg',
            val:() => {
                return {
                    PublicKeyBase58Check: 'BC1YLi1A7nWDTEmDjaT3F1ba32nqH8YSqVP2TBHcrZZNnf2eyadTkSN'}
            }
        },
        type:'send'
    })
    const exhRate = await getExchangeRate();
    const transaction = task.getTransaction(exhRate.USDbyBTCLT);
}

// testTask().then(() =>{});
app.post('/task', async (req, res, next) => {
    var data = req.body.data;
    var publicKey;
    var task;
    var customToken = req.headers.authorization.replace('Bearer ', '');
    try {
        let verif = await auth.verifyIdToken(customToken);
        publicKey = verif.uid;
    } catch(error) {
        res.send({data:{error: error.message}})
        return
    }

    const megazordRef = db.ref('megazords/' + data.megazordId);
    var megazorSnap = await megazordRef.get();
    // var megazorSnap = await megazordRef.get()
    if (megazorSnap.exists()) {
        var megazord = megazorSnap.val();
    } else {
        res.send({data:{error: 'Task not Found'}});
    }
    switch (data.action) {
        case 'create':
            task = Tasks.createTask({
                ...data.task,
                addedBy: publicKey,
                megazorSnap: megazorSnap
            });

            await megazordRef.child('tasks').push(task.toDBRecord());
            res.send({data:{}})
            break;
        case 'delete':
            await megazordRef.child('tasks/' + data.task.id).remove();
            res.send({data:{}})
            break;
        case 'powerOn':
            var taskId = data.task.id;
            var taskShrtId = crypto.randomBytes(3).toString('hex');
            var encryptionKey = crypto.randomBytes(8).toString('hex');

            var dbTask = megazord.tasks[data.task.id];
            // task = Tasks.taskFromDB(dbTask, megazordRef);
            var taskSessionRef =  await db.ref('taskSessions/' + taskId).get()
            if (!taskSessionRef.exists()) {
                var taskSession = {
                    taskId: taskId,
                    initiator: {publicKey},
                    megazordId: data.megazordId,
                    task: dbTask,
                    readyZordsShrtIds: [],
                    expire: Date.now() + taskSessionsExpire,
                    endPoint: functionsUrl,
                    redirect: '/admin/tasks_list/' + data.megazordId
                }
                var zords = megazord.confirmedZords;
                var resZords = [];
                for (let zordId in zords) {
                    let shrtId = crypto.randomBytes(2).toString('hex');
                    try {
                        var profileRes = await bitcloutProxy({
                            action: 'get-single-profile',
                            PublicKeyBase58Check: zordId,
                            Username: ''
                        });
                    } catch (err) {
                        res.send({data:{error: err.toString()}});
                        return
                    }
                    resZords.push({
                        PubKeyShort: zordId.slice(0, 14) + '...',
                        PublicKeyBase58Check: zordId,
                        shrtId: shrtId,
                        Username: profileRes.Profile.Username,
                        ProfilePic: profileRes.Profile.ProfilePic,
                        link: `/gts/${taskShrtId}&${shrtId}&${encryptionKey}`
                    })
                    if (zordId === publicKey) {
                        taskSession.initiator.shrtId = shrtId;
                        taskSession.initiator.Username = profileRes.Profile.Username;
                    }
                }
                taskSession.zords = resZords;
                db.ref('taskSessions').child(taskShrtId).set(taskSession);
                res.send({data:{taskLink: `/gts/${taskShrtId}&${taskSession.initiator.shrtId}&${encryptionKey}`}})

            } else {
                let taskSession = taskSessionRef.val();
                res.send({data:{info: `Task already running. Ask ${taskSession.initiator.Username} for personal link.`}})
            }

            // var transaction = task.toTransaction();
            // template = template.replace('%transaction%', JSON.stringify(transaction));
            break;
    }
});

exports.api = functions.https.onRequest(app);

exports.shortener = functions.https.onRequest(async (req, res) => {
    var subNamesMap = {t: 'tasks'};
    var pathSplit = req.path.split('/')
    var subName = subNamesMap[pathSplit[2]];
    var shrtLink = pathSplit.pop();
    var snapshot = await db.ref('shortener/' + subName).child(shrtLink).get();
    if (snapshot.exists()) {
        var link = snapshot.val().link;
    } else {
        res.status(404).send('Page Not Flound');
    }
    res.writeHead(302, {
        'Location': link
        //add other headers here...
    });
    res.end();
})

exports.getTaskSession = functions.https.onRequest(async (req, res) => {
    var taskShrtId = req.path.split('/').pop().split('&')[0];
    const taskSessionRef = await db.ref('taskSessions/' + taskShrtId).get();
    if (taskSessionRef.exists()) {
        var taskSession = taskSessionRef.val();
    } else {
        res.write('Task Session not exists or expired');
        res.end();
    }
    try {
        var template = await readFile("./templates/taskSession/task-template.html");
        var bip39_lib = await readFile("./templates/taskSession/bip39.browser.js");
        var crypto_lib = await readFile("./templates/taskSession/crypto.browser.js");
        template = template.toString();
        bip39_lib = bip39_lib.toString();
        crypto_lib = crypto_lib.toString();
    } catch (e) {
        res.write('Template reading error.');
        res.end();
    }
    template = template.replace('"%bip39.browser.js%"', bip39_lib);
    template = template.replace('"%crypto.browser.js%"', crypto_lib);
    template = template.replace('"%taskSession%"', JSON.stringify(taskSession,  null, 2));
    res.writeHeader(200, {"Content-Type": "text/html; charset=utf-8"});
    res.write(template);
    res.end();
});

//Protected functionality.
const nestedApp = express();
nestedApp.use(helmet());
nestedApp.use(cors({ origin: true }));
nestedApp.use(express.json({limit:'100kb'}))

async function finishTask(zords, megazordId, task, error) {
    if (!error) {
        await db.ref('megazords/' + megazordId + '/tasks').child(task.id).remove();
    }
    var notificationType = error ? 'taskFailed' : 'taskDone'
    for (let zord of zords) {
        await db.ref('users/' + zord).child('notifications').push(notifications(notificationType, {
            taskType: task.type,
            error: error
        }))
    }
}

nestedApp.post('/readyCheck', async (req, res, next) => {
    var {taskShrtId, zordShrtId} = req.body.data;
    const taskSessionRef = await db.ref('taskSessions/' + taskShrtId).get();
    if (!taskSessionRef.exists()) {
        res.send({data: { error: 'Taks not exists or expired.'}})
        return
    }
    var taskSession = taskSessionRef.val()
    taskSession.readyZordsShrtIds = taskSession.readyZordsShrtIds || [];
    if (taskSession.readyZordsShrtIds.length == taskSession.zords.length) {
        res.send({data: { ok: true }})
        return
    }
    taskSession.readyZordsShrtIds.push(zordShrtId)
    db.ref('taskSessions/' + taskShrtId).child('readyZordsShrtIds').set(taskSession.readyZordsShrtIds);
    res.send({data: {readyZordsShrtIds: taskSession.readyZordsShrtIds}});
});

function zordsToMegazord(encryptedZordsEntropy, encryptionKey) {
    let length = 0;
    var zordsEntropy = [];

    for (let zordEntropy of encryptedZordsEntropy) {
        const decipher = crypto.createDecipher('aes-256-gcm', encryptionKey);
        zordEntropy = decipher.update(Buffer.from(zordEntropy, 'hex')).toString();
        if (!entropyService.isValidCustomEntropyHex(zordEntropy)) {
            throw new Error('Invalid mnemonic');
        }
        zordEntropy = Buffer.from(zordEntropy, 'hex')
        length += zordEntropy.length;
        zordsEntropy.push(zordEntropy);
    }
    let megazordEntropy = new Uint8Array(length);
    let offset = 0;
    for (let zordEntropy of zordsEntropy) {
        megazordEntropy.set(zordEntropy, offset);
        offset += zordEntropy.length;
    }
    const megazordMnemonic = bip39.entropyToMnemonic(megazordEntropy);
    try {
        if (!entropyService.isValidCustomEntropyHex(Buffer.from(megazordEntropy).toString('hex'))) {
            throw new Error('Invalid mnemonic');
        }
    } catch {
        throw new Error('Invalid mnemonic');
    }
    const keychain = cryptoService.mnemonicToKeychain(megazordMnemonic, '');
    const seedHex = cryptoService.keychainToSeedHex(keychain);
    const privateKey = cryptoService.seedHexToPrivateKey(seedHex);
    const publicKey = cryptoService.privateKeyToBitcloutPublicKey(privateKey, 'mainnet');

    return [seedHex, publicKey]
}
// Create a new array with total length and merge all source arrays.

nestedApp.post('/power', async (req, res, next) => {
    const {taskShrtId, zordShrtId, encryptedEntropy, encryptionKey} = req.body.data;
    const taskSessionRef = await db.ref('taskSessions/' + taskShrtId).get();
    const encryptedSeedsRef = await db.ref('protected/encryptedSeeds/' + taskShrtId).get();
    var encryptedSeeds = null;
    if (!taskSessionRef.exists()) {
        res.send({data: { error: 'Taks not exists or expired.'}})
        return
    }
    const taskSession = taskSessionRef.val();
    const zordsCount = taskSession.zords.length;
    if (encryptedSeedsRef.exists()) {
        encryptedSeeds = encryptedSeedsRef.val();
    } else {
        encryptedSeeds = {
            expire: taskSession.expire,
            zordsEntropy: []
        }
    }
    encryptedSeeds.zordsEntropy = encryptedSeeds.zordsEntropy || [];
    if (encryptedSeeds.zordsEntropy.length === zordsCount) {
        res.send({data: { ok: true }});
        return
    }
    for (let zord of taskSession.zords) {
        if (zord.shrtId === zordShrtId) {
            encryptedSeeds.zordsEntropy.push({
                PublicKeyBase58Check: zord.PublicKeyBase58Check,
                encryptedEntropy: encryptedEntropy
            })
        }
    }

    res.send({data: { ok: true }});
    if (encryptedSeeds.zordsEntropy.length !== zordsCount) {
        await db.ref('protected/encryptedSeeds').child(taskShrtId).set(encryptedSeeds);
        return
    }

    var task = {id: taskSession.taskId, type: taskSession.task.type};
    var zordsIds = taskSession.zords.map(it => it.PublicKeyBase58Check).sort();
    var zordsEntropySignature = new Array(zordsCount);
    for (let zord of encryptedSeeds.zordsEntropy) {
        let position = zordsIds.indexOf(zord.PublicKeyBase58Check)
        zordsEntropySignature[position] = zord.encryptedEntropy
    }

    var taksError = ''
    try {
        var [megazordSeedHex, megazordPublicKey] = zordsToMegazord(zordsEntropySignature, encryptionKey);
    } catch(e) {
        taksError = 'Zord Seeds is Uncorrect';
        finishTask(zordsIds, taskSession.megazordId, task, taksError);
        return
    }
    if (task.type === 'getPublicKey') {
        await db.ref('megazords/' + taskSession.megazordId).child('PublicKeyBase58Check').set(megazordPublicKey);
    } else {
        taksError = 'Task Not Implemented yet.';
    }
    finishTask(zordsIds, taskSession.megazordId, task, taksError);
    //clear seed phrases
    encryptedSeeds = {};
    zordsEntropySignature = [];
    megazordSeedHex = '';
    await db.ref('protected/encryptedSeeds').child(taskShrtId).remove();
    await db.ref('taskSessions').child(taskShrtId).remove();
})

exports.powerTask = functions.https.onRequest(nestedApp);
// exports.signUp = functions.https.onRequest((request, response) => {
//     return cors()(request, response, () => {
//         userName = request.data.userName
//         console.log(userName)
//         response.send({"data":`Hello ${userName} from Firebase!`});
//     });
// });