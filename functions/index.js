const functions = require("firebase-functions");
const cors = require('cors');
const express = require('express');
const adapters = require('./api_adapters').adapters;
const BitcloiutApi = require('./bitclout_api').BitcloiutApi
const helmet = require("helmet");
const sanitizer = require('sanitizer');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const megazord_seed = require('../dev_data/megazord.json').seed;
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

app.post('/sign-up', async (req, res, next) => {
    try {
        var userName = getReqData(req, 'userName');
    } catch (err) {
        res.status(422).send({message: 'userName includes unexepted characters.'})
    }
    console.log('userName:', userName);
    let result = await bitcloiutApi.signUp(userName, megazord_seed);
    if (result instanceof Error) {
        res.status(404)
        res.send({error: result.message})
    }
    res.send({"data":`Hello ${description} from Firebase!`})
});
exports.api = functions.https.onRequest(app);
// exports.signUp = functions.https.onRequest((request, response) => {
//     return cors()(request, response, () => {
//         userName = request.data.userName
//         console.log(userName)
//         response.send({"data":`Hello ${userName} from Firebase!`});
//     });
// });