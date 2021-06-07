
const axios = require('axios');

class Task {
    constructor(data) {
        this.type = data.type;
        this.description = data.description || data.defaultDescription;
        this.addedBy = data.addedBy;
        this.Recipient = data.Recipient;
        this.status = data.status || 0; //Status 0 - active
        this.date = Date.now();
    }

    static fromDBRecord(dbRecord) {

    }

    static fromTransaction() {

    }

    toDBRecord() {
        var dbRecord = {
            type: this.type,
            description: this.description,
            addedBy: this.addedBy,
            Recipient: this.Recipient,
            date: this.date
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
        data.defaultDescription = 'Lounch this task for activate account and get public key';
        super(data);
    }
}

class Send extends Task {
    constructor(data) {
        var AmountNanos = parseFloat(data.AmountNanos) || 0;
        data.defaultDescription =
        `Send ${parseFloat((AmountNanos * 1e-9).toFixed(4)).toLocaleString()} ${data.Currency} to ${data.Recipient}`;
        super(data);
        this.AmountNanos = AmountNanos;
        this.Currency = data.Currency;
    }

    toDBRecord() {
        var record = super.toDBRecord();
        record.AmountNanos = this.AmountNanos;
        record.Currency = this.Currency;
        return record;
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
        this.transactions.push(preview);
        // const feePreview = await bitcloutApi.SendBitCloutPreview(
        //     endpoint,
        //     this.megazordRef.key,
        //     CloutMegazordPubKey,
        //     feeNanos,
        //     MinFeeRateNanosPerKB
        // );
        // this.transactions.push(feePreview);
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
            break;
        }
        case 'send': {
            task = new Send(data);
            break;
        }
    }
    return task;
}

exports.Tasks = {
    createTask: createTask,
    taskFromDB(dbRecord) {
        var addedBy = Object.keys(dbRecord.addedBy)[0]
        var data = {...dbRecord, megazorSnap, id, addedBy}
        return createTask(data);
    }
};