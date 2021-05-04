const axios = require('axios');
const commandsMap = {
    getProfile: "https://api.bitclout.com/get-single-profile"
};

class BitcloiutApi {
    constructor(api_adapter) {
        this.api_adapter = api_adapter;
    }

    async getUserInfo(Username) {
        try {
            console.log('Post inf', commandsMap['getProfile'], Username)
            const resp = await axios.post(commandsMap['getProfile'], {
                PublicKeyBase58Check: "",
                Username: Username
            });
            console.log(resp.data);
            return resp.data.Profile;
        } catch (err) {
            console.error('message:', err.message);
            if (err.message == '') {
                throw new Error('User not found.');
            } else {
                throw new Error('Undefined getUser error.');
            }
        }
    }

    async signIn(){}

    async signUp(userName, seed) {
        try {
            var profile = await this.getUserInfo(userName)
        } catch (err) {
            return err;
        }

        return profile.Description;
    }

    async sendMessage() {}

    async sendBitClout() {}

    async marketAction() {}

    async buy() {}

    async sell() {}
}

exports.BitcloiutApi = BitcloiutApi;