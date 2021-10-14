
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
        data.defaultDescription = 'Launch this task to activate account and get public key';
        super(data);
    }

    toDBRecord() {
        var record = super.toDBRecord();
        return record;
    }
}

class Send extends Task {
    constructor(data) {
        var AmountNanos = parseInt(data.AmountNanos) || 0;
        var currencyPostfix = (data.Currency === '$DESO') ? '' : ' coin';
        data.defaultDescription =
        `Send ${parseFloat((AmountNanos * 1e-9).toFixed(4)).toLocaleString()} ${data.Currency + currencyPostfix} to ${data.RecipientUsername ? '@' + data.RecipientUsername : data.Recipient}`;
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

class Repost extends Task {
    constructor(data) {
        data.type = 'repost'
        data.defaultDescription = `Launch this task to Repost: ${data.link}`;
        super(data);
        if (data.link.includes('http')) {
            this.postHash = data.link.split('/').pop().split('?')[0];
        } else {
            this.postHash = data.link;
        }
    }

    toDBRecord() {
        var record = super.toDBRecord();
        record.postHash = this.postHash;
        return record;
    }
}

class UpdateProfile extends Task {
    constructor(data) {
        data.type = 'updateProfile'
        data.defaultDescription = '';
        if (data.NewUsername) {
            data.defaultDescription += ` NewUsername: ${data.NewUsername};`
        }
        if (data.NewDescription !== undefined) {
            var postfix = '\n@mgzd'
            var postfixRegExp = new RegExp('.*' + postfix + '$');
            if(!postfixRegExp.test(data.NewDescription)) {
                data.NewDescription = data.NewDescription.slice(0, 280 - postfix.length) + postfix;
            }
            data.defaultDescription += ` NewDescription: ${data.NewDescription};`
        }
        if (data.founderRewardInput !== undefined) {
            data.defaultDescription += ` FR: ${data.founderRewardInput}%;`
        }
        if (data.NewProfilePic !== undefined) {
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
        if (this.NewUsername) {
            record.NewUsername = this.NewUsername;
        }
        if (this.NewDescription) {
            record.NewDescription = this.NewDescription;
        }
        if (this.NewProfilePic) {
            record.NewProfilePic = this.NewProfilePic;
        }
        if (this.NewCreatorBasisPoints) {
            record.NewCreatorBasisPoints = this.NewCreatorBasisPoints;
        }
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
        case 'repost': {
            task = new Repost(data);
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