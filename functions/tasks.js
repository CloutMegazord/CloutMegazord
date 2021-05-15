

class Task {
    constructor(data) {
        this.type = data.type;
        this.description = data.description || data.defaultDescription;
        this.addedBy = data.addedBy;
        this.megazord = data.megazord;
        this.target = data.target;
        this.date = Date.now();
    }

    fromDBRecord() {

    }

    toDBRecord() {
        return {
            type: this.type,
            description: this.description,
            addedBy: {[this.addedBy]: true},
            date: this.date
         }
    }

    fromTransaction() {

    }

    toTransaction() {

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
    taskFromDB() {

    }
};