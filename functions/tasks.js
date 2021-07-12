
const axios = require('axios');

class Task {
    constructor(data) {
        this.type = data.type;
        this.description = data.description || data.defaultDescription;
        this.addedBy = data.addedBy;
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
        data.defaultDescription = 'Launch this task for activate account and get public key';
        super(data);
        this.Recipient = data.Recipient;
    }

    toDBRecord() {
        var record = super.toDBRecord();
        record.Recipient = this.Recipient;
        return record;
    }
}

class Send extends Task {
    constructor(data) {
        var AmountNanos = parseFloat(data.AmountNanos) || 0;
        var currencyPostfix = (data.Currency === '$ClOUT') ? '' : ' coin';
        data.defaultDescription =
        `Send ${parseFloat((AmountNanos * 1e-9).toFixed(4)).toLocaleString()} ${data.Currency + currencyPostfix} to @${data.RecipientUsername}`;
        super(data);
        this.Recipient = data.Recipient;
        this.RecipientUsername = data.RecipientUsername;
        this.AmountNanos = AmountNanos;
        this.Currency = data.Currency;
        this.CreatorPublicKeyBase58Check = data.CreatorPublicKeyBase58Check;
    }

    toDBRecord() {
        var record = super.toDBRecord();
        record.AmountNanos = this.AmountNanos;
        record.Currency = this.Currency;
        record.Recipient = this.Recipient;
        record.CreatorPublicKeyBase58Check = this.CreatorPublicKeyBase58Check;
        return record;
    }
}

class UpdateProfile extends Task {
    constructor(data) {
        data.type = 'updateProfile'
        data.defaultDescription = 'Update Profile.';
        if (data.NewUsername) {
            data.defaultDescription += ` NewUsername: ${data.NewUsername};`
        }
        if (data.NewDescription) {
            data.defaultDescription += ` NewDescription: ${data.NewUsername};`
        }
        if (data.founderRewardInput) {
            data.defaultDescription += ` FR: ${data.founderRewardInput};`
        }
        if (data.NewProfilePic) {
            data.defaultDescription += ` Update Avatar;`
        }
        super(data);
        this.NewUsername = data.NewUsername;
        this.NewDescription = data.NewDescription;
        this.NewProfilePic = data.NewProfilePic;
        this.NewCreatorBasisPoints =  Math.floor(data.founderRewardInput * 100);
    }

    toDBRecord() {
        var record = super.toDBRecord();
        record.NewUsername = this.NewUsername;
        record.NewDescription = this.NewDescription;
        record.NewProfilePic = this.NewProfilePic;
        record.NewCreatorBasisPoints = this.NewProfilePic;
        return record;
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
        case 'updateProfile': {
            task = new UpdateProfile(data);
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