const BackendApiService = require('./bitclout/backend-api.service').BackendApiService;
const axios = require('axios');

const bitcloutApi = new BackendApiService({
    post: (endpoint, data) => {
        return axios.post(endpoint, data, {headers: {'Content-Type': 'application/json'}})
            .then((response) =>{
                debugger
            }).catch((e) => {
                debugger
            })
    }
});
bitcloutApi._handleError = (e) => {
    console.log(e);
    debugger
}
const MinFeeRateNanosPerKB = 1000;
const CloutMegazordPubKey = 'BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE';
const endpoint = 'bitclout.com';

class Task {
    constructor(data) {
        this.type = data.type;
        this.description = data.description || data.defaultDescription;
        this.addedBy = data.addedBy;
        this.megazord = data.megazorSnap.val();
        this.megazord.id = data.megazorSnap.key;
        this.Recipient = data.Recipient;
        this.status = data.status || 0; //Status 0 - active
        this.date = Date.now();
        this.transactions = [];
    }

    static fromDBRecord(dbRecord) {

    }

    static fromTransaction() {

    }

    toDBRecord() {
        var dbRecord = {
            type: this.type,
            description: this.description,
            addedBy: {[this.addedBy]: true},
            Recipient: this.Recipient,
            megazord: {},
            date: this.date
         }
        dbRecord.megazord.id = this.megazord.id
        if (this.megazord.PublicKeyBase58Check) {
            dbRecord.megazord.PublicKeyBase58Check = this.megazord.PublicKeyBase58Check;
        }

        return dbRecord;
    }

    toTransaction() {

    }

    toJSON() {

    }
}

class GetPublicKey extends Task {
    constructor(data) {
        data.type = 'getPublicKey'
        data.defaultDescription = 'Lounch this task for activate account and get public key.';
        super(data);
    }
}

class Send extends Task {
    constructor(data) {
        super(data);
        this.AmountNanos = parseFloat(data.AmountNanos);
    }

    getFee(AmountNanos, bitcloutPriceUSD) {
        var AmountNanosUSD = AmountNanos / 1e9 * bitcloutPriceUSD;
        const feesMap = {
          3: 1 * 10**4,
          2: 1 * 10**5,
          1: 1 * 10**6,
          0.5: Infinity
        }
        var fees = Object.keys(feesMap).sort().reverse();
        var trgFee = fees[0];
        for (let fee of fees) {
            let range = feesMap[fee];
            if (AmountNanosUSD < range) {
              trgFee = parseFloat(fee);
              break
            }
        }
        return AmountNanos * (trgFee / 100);
    }
}

class SendBitclouts extends Send {
    constructor(data) {
        super(data);
    }
    // SatoshisPerBitCloutExchangeRate: exchangeRate.SatoshisPerBitCloutExchangeRate,
    // USDCentsPerBitcoinExchangeRate: ticker.USD.last,
    // USDbyBTCLT: ticker.USD.last * (exchangeRate.SatoshisPerBitCloutExchangeRate / 100000000)
    async getTransaction(bitcloutPriceUSD) {
        const feeNanos = this.getFee(this.AmountNanos, bitcloutPriceUSD);
        try {
            var preview = await bitcloutApi.SendBitCloutPreview(
                endpoint,
                this.megazord.PublicKeyBase58Check,
                this.Recipient,
                this.AmountNanos - feeNanos,
                MinFeeRateNanosPerKB
            );
        } catch (e) {
            debugger
            throw e;
        }
        debugger
        this.transactions.push(preview);
        // const feePreview = await bitcloutApi.SendBitCloutPreview(
        //     endpoint,
        //     this.megazordRef.key,
        //     CloutMegazordPubKey,
        //     feeNanos,
        //     MinFeeRateNanosPerKB
        // );
        // this.transactions.push(feePreview);
        debugger
    }
}

class SendKey extends Task {
    constructor() {
        super();
    }
}

function createTask(data) {
    var task;
    switch (data.type) {
        case 'getPublicKey': {
            task = new GetPublicKey(data)
        }
        case 'send': {
            if (data.Currency === "$BitClouts") {
                task = new SendBitclouts(data)
            } else if (data.Currency === "Coins") {
                task = new SendCoins(data)
            }
        }
    }
    return task;
}

exports.Tasks = {
    createTask: createTask,
    taskFromDB(dbRecord, megazorSnap, id) {
        var addedBy = Object.keys(dbRecord.addedBy)[0]
        var data = {...dbRecord, megazorSnap, id, addedBy}
        return createTask(data);
    }
};