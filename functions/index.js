var KeyEncoder = require('key-encoder').default;
const EC = require('elliptic').ec;
const axios = require('axios');
const https = require('https');
const functions = require("firebase-functions");
const cors = require('cors');
const express = require('express');
const adapters = require('./api_adapters').adapters;
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
    await userRef.set({
        [userId]: {
            createTime: Date.now(),
        }
      });
    await userRef.child(userId).child('notifications').push(notifications('welcome', {}))
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
        console.log(err)
        res.send({data:{error: 'Firebase Error.'}})
        return;
    }

    // const customToken = auth.createCustomToken(publicKey);
    // if (user) {

    //     res.status(200).send({data: {"token": user.customToken}})
    // }

    // const [isValid, _] = validatePublicKey(jwt_token, publicKey)
    // if (isValid) {
    //     auth.createCustomToken(publicKey)
    //     .then((customToken) => {
    //         // Send token back to client
    //         res.status(200).send({data: {"token": customToken}})
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         res.status(400).send({data: {message: 'Firebase Error.'}})
    //     });
    // } else {
    //     res.status(401).send({data: {message: 'Uncorrect user data.'}})
    // }
})

app.post('/sign-up', async (req, res, next) => {

})

app.post('/bitclout-proxy', async (req, res, next) => {
    var data = req.body.data;
    const action = data['action'];
    delete data['action']
    axios.post("https://api.bitclout.com/" + action,
        data,
        {headers: {'Content-Type': 'application/json'}
    }).then(resp => {
        res.send({data: resp.data})
    }).catch(error => {
        res.send({data: { error: error.toString()}})
    });
});

exports.api = functions.https.onRequest(app);
// exports.signUp = functions.https.onRequest((request, response) => {
//     return cors()(request, response, () => {
//         userName = request.data.userName
//         console.log(userName)
//         response.send({"data":`Hello ${userName} from Firebase!`});
//     });
// });