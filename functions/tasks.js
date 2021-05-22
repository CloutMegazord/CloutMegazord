

class Task {
    constructor(data) {
        this.type = data.type;
        this.description = data.description || data.defaultDescription;
        this.addedBy = data.addedBy;
        this.megazordRef = data.megazordRef;
        this.Recipient = data.Recipient;
        this.status = data.status || 0; //Status 0 - active
        this.date = Date.now();
    }

    static fromDBRecord(dbRecord) {

    }

    static fromTransaction() {

    }

    toDBRecord() {
        return {
            type: this.type,
            megazord: this.megazordRef.key,
            description: this.description,
            addedBy: {[this.addedBy]: true},
            Recipient: this.Recipient,
            date: this.date
         }
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
    constructor(data) {}
}

class SendBitclouts extends Send {
    constructor(data) {}
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
    }
    return task;
}

exports.Tasks = {
    createTask: createTask,
    taskFromDB(dbRecord, megazordRef, id) {
        var addedBy = Object.keys(dbRecord.addedBy)[0]
        var data = {...dbRecord, megazordRef, id, addedBy}
        return createTask(data);
    }
};