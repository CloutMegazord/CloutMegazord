

class Task {
    constructor(data) {
        this.type = data.type;
        this.description = data.description || data.defaultDescription;
        this.addedBy = data.addedBy;
        this.megazordRef = data.megazordRef;
        this.Recipient = data.Recipient;
        this.date = Date.now();
        this.id = data.id || ''+  this.date;
    }

    static fromDBRecord(dbRecord) {


    }

    static fromTransaction() {

    }


    toDBRecord() {
        return {
            type: this.type,
            description: this.description,
            addedBy: {[this.addedBy]: true},
            Recipient: this.Recipient,
            date: this.date
         }
    }

    toTransaction() {

    }

    toJSON() {
        // addedBy:'BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE'
        // date:1621178525967
        // description:'Lounch this task for activate account and get public key.'
        // id:'-M_plE_qK0u2YgyhpTMm'
        // megazordRef:Reference {repo: Repo, path: Path, queryParams_: QueryParams, orderByCalled_: false}
        // Recipient:'Traget Megazrod'
        // type:'getPublicKey'
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