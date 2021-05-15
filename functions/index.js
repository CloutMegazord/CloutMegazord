var KeyEncoder = require('key-encoder').default;
const EC = require('elliptic').ec;
const axios = require('axios');
const https = require('https');
const functions = require("firebase-functions");
const cors = require('cors');
const express = require('express');
const adapters = require('./api_adapters').adapters;
const Tasks = require('./tasks').Tasks;
const BitcloiutApi = require('./bitclout_api').BitcloiutApi
const helmet = require("helmet");
const sanitizer = require('sanitizer');
const admin = require("firebase-admin");
const jwt = require('jsonwebtoken');
const bs58check = require('bs58check');
const notifications = require('./notifications');

admin.initializeApp();
const db = admin.database();
const auth = admin.auth()
db.useEmulator("localhost", 9000)
const AdminBTLTPubKey = 'BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE';
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// "adminContent": {
//     ".read": "auth.uid === 'some-uid'"
//   }
// const megazord_seed = require('../dev_data/megazord.json').seed;
const adapterName = 'puppeteer_adapter'//will get from env
const bitcloiutApi = new BitcloiutApi(new adapters[adapterName]())
const app = express();


function getReqData(req, field) {
    let data = req.body.data[field];
    let sanitData = sanitizer.sanitize(req.body.data[field]);
    if (data !== sanitData) {
        throw new Error('Unsafety data.');
    }
    return sanitData;
}

app.use(helmet());
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(express.json({limit:'100kb'}))
// exports.signIn = functions.https.signIn((request, response) => {
//     return cors()(request, response, () => {
//         response.send({"data":"Hello from Firebase!"});
//     });
// });
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
    return new Promise((resolve, reject) => {
        const action = data['action'];
        delete data['action']
        axios.post("https://api.bitclout.com/" + action,
            data,
            {headers: {'Content-Type': 'application/json'}
        }).then(resp => {
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
        megazordsRef.orderByChild('pendingZords/' + userId).once('value', async function(s) {
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
        seedSignature: [owner, ...zords],
        confirmedZords: {[owner]: true},
        pendingZords: zords.reduce((prev, curr, i) => {
            prev[curr] = true;
            return prev;
        }, {})
    });
    await db.ref('users/' + owner).child('megazords').child(newMegazordRef.key).set(true);
    for (const zord of zords) {
        user = await getUser(zord);
        if (!user) {continue;}
        var userRef = db.ref('users/' + zord)
        var userMegazordsRef = userRef.child('megazords')
        await userMegazordsRef.child(newMegazordRef.key).set(true);
        await userRef.child('notifications').push(notifications('newMegazord', {}))
    }
}

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
    }
    delete megazord.pendingZords[publicKey];
    megazord.confirmedZords[publicKey] = true;

    await megazordRef.set(megazord)
    const task = Tasks.createTask({
        type: 'getPublicKey',
        addedBy: AdminBTLTPubKey,
        megazord: megazordRef
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
    isValid = (zordsList.length + 1) < 5;
    //All Id are unique
    isValid = isValid && ([...new Set([publicKey].concat(zordsList))].length === [publicKey].concat(zordsList).length)
    if (!isValid) {
        res.send({data:{error: 'Zords data invalid.'}})
        return
    }
    for (i = 0; i < zordsList.length; i += 1) {
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

app.post('/bitclout-proxy', async (req, res, next) => {
    var data = req.body.data;
    try {
        let result = await bitcloutProxy(data);
        res.send({data: result})
    } catch(error) {
        res.send({data: { error: error.toString()}})
    }
});

exports.api = functions.https.onRequest(app);
// exports.signUp = functions.https.onRequest((request, response) => {
//     return cors()(request, response, () => {
//         userName = request.data.userName
//         console.log(userName)
//         response.send({"data":`Hello ${userName} from Firebase!`});
//     });
// });