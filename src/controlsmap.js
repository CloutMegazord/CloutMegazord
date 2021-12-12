import React from "react";
import {
  InputBitcloutAccount,
  InputAmount,
  BitcloutAccountItem,
  Description,
  UploadFile,
  FounderReward,
  BitcloutPostLink,
} from "components/FormControls/FormControls";


const getPublicKey = (data) => {
  const megazord = data.megazord;
  const user = data.user;
  return {
    name: 'Get Public Key',
    controls: [
      {
        name: 'Recipient',
        component: <BitcloutAccountItem
          htmlIds={{Recipient: "getPublicKey_Recipient_value"}}
          item={megazord}
          label={'Recipient'}
          values={{Recipient: megazord.Username || megazord.PubKeyShort || "TargetMegazord"}}/>,
        // possibleInputType: ['Current Account'],
        values: {
          Recipient: {id: 'getPublicKey_Recipient_value', required: true}
        },
        disabled: true
      }
    ],
    disabled: false
  }
}

const updateProfile = (data) => {
  const {megazord, user, indexFunctons, bitcloutData, api_functions} = data;
  const postfix = '\n@mgzd'
  const validateUsername = (account, accName) => {
    if (accName.match(/^[a-zA-Z0-9_]+$/) === null) {
      indexFunctons.notifSnak('open', 'error', 'Your username contains invalid characters. Usernames can only numbers, English letters, and underscores.', 5000);
      throw Error('Your username contains invalid characters. Usernames can only numbers, English letters, and underscores.');
    }
    if (account && (account.Username !== megazord.Username)) {
      indexFunctons.notifSnak('open', 'error', 'Name already used', 2000);
      throw Error('Name already used.');
    }
    return true
  }

  const validateAvatar = (fileToUpload) => {
    let errorMessage = '';
    if (!fileToUpload.type || !fileToUpload.type.startsWith("image/")) {
      errorMessage = "File selected does not have an image file type."
      indexFunctons.notifSnak('open', 'error', errorMessage, 7000);
      throw Error(errorMessage);
    }
    if (fileToUpload.size >= 5 * 1024 * 1024) {
      errorMessage = "Please upload an image that is smaller than 5MB.";
      indexFunctons.notifSnak('open', 'error', errorMessage, 7000);
      throw Error(errorMessage);
    }
    return true
  }

  return {
    name: 'Update Profile',
    validate() {
      if ((megazord.BalanceNanos <= bitcloutData.appState.CreateProfileFeeNanos) &&
          (megazord.Username === api_functions.defaultUsername)) {
        let errorMessage = 'To create an account, you need to fund your account on $' +
         (bitcloutData.appState.CreateProfileFeeNanos / 1e9 * bitcloutData.exchangeRate.USDbyDeSo + 0.1)
         .toFixed(2).toLocaleString() || true;
        indexFunctons.notifSnak('open', 'error', errorMessage, 5000);
        throw new Error(errorMessage)
      }
    },
    controls: [
      {
        name: 'NewUsername',
        component:  <InputBitcloutAccount
          placeholder={"Username"}
          validate={validateUsername}
          user={user}
          htmlIds={{RecipientUsername: "updateProfile_RecipientUsername_value"}}
          valueProp={megazord.Username === api_functions.defaultUsername ? '' : megazord.Username}
        />,
        values: {
          NewUsername: {
            id: 'updateProfile_RecipientUsername_value',
            required: !megazord.Username,
            type:'string',
            default: megazord.Username}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'NewDescription',
        component:  <Description
          label={"Account Description"}
          htmlIds={{Description: "updateProfile_Description_value"}}
          maxLength={280 - postfix.length}
          postfix={postfix}
          user={user}
          valueProp={megazord.Description || ''}
        />,
        values: {
          NewDescription: {
            id: 'updateProfile_Description_value',
            required: false,
            type:'string',
            default: megazord.Description}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'NewProfilePic',
        component:  <UploadFile
          maxSize={5 * 1024 * 1024}
          user={user}
          validate={validateAvatar}
          htmlIds={{Avatar: "updateProfile_avatar"}}
          valueProp={megazord.ProfilePic}
          loadFile={api_functions.loadFile}
        />,
        //get from window object
        values: {
          NewProfilePic: {
            id: 'updateProfile_avatar',
            required: megazord.ProfilePic === api_functions.defaultAvatar,//required
            default: megazord.ProfilePic,
            type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'founderRewardInput',
        component:  <FounderReward
        htmlIds={{FR: "updateProfile_FR"}}
        valueProp={(megazord.founderRewardInput === undefined) ? 100 : megazord.founderRewardInput}
        />,
        values: {
          founderRewardInput: {
            id: 'updateProfile_FR',
            required: true,
            type:'float'
          }
        },
        disabled: false
      }
    ],
    disabled: false
  }
}

const send = (data) => {
  const {megazord, user, api_functions, bitcloutData, indexFunctons} = data;

  const validateRecipient = (account) => {
    if (account.id === megazord.PublicKeyBase58Check) {
      throw Error('Cant send to self Megazord.');
    }
    return true
  }
  const validateCurrencies = (currency) => {
    if (currency !== "$DESO" && wallet['$DESO'].BalanceNanos < 10000) {
      let errorMess = 'Top up your $DESO balance to cover transaction fees (~ $ 0.01 equivalent)';
      indexFunctons.notifSnak('open', 'error', errorMess, 7000);
      throw Error(errorMess);
    }
    return true;
  }  
  const wallet = Object.assign(
    {'$DESO': {BalanceNanos: megazord.BalanceNanos, CreatorPublicKeyBase58Check: ''}},
    megazord.UsersYouHODL.reduce((reducer, it)=>{
      reducer[it.ProfileEntryResponse.Username] = {
        BalanceNanos: it.BalanceNanos,
        CreatorPublicKeyBase58Check: it.CreatorPublicKeyBase58Check,
        CoinPriceBitCloutNanos: it.ProfileEntryResponse.CoinPriceBitCloutNanos
      }
      return reducer
    }, {})
  )

  const processAmount = (inputValue, currency) => {
    let amountObj = {}
    let usdAmount;
    let exchRate = bitcloutData.exchangeRate
    let USDbyDeSo  = exchRate.USDbyDeSo;
    let USDAmount = inputValue * USDbyDeSo;
    let USDValueAfterFees;
    var fees = Object.keys(megazord.feesMap).sort().reverse();
    var trgFee = fees[0];
    for (let fee of fees) {
      let range = megazord.feesMap[fee];
      if (usdAmount < range) {
        trgFee = fee;
        break
      }
    }
    let inputValueAfterFees = inputValue - (inputValue * (trgFee / 100));
    debugger
    if (wallet[currency].CreatorPublicKeyBase58Check) {
      let CoinPriceBitCloutNanos = wallet[currency].CoinPriceBitCloutNanos;
      USDValueAfterFees = inputValueAfterFees * (CoinPriceBitCloutNanos / 1e9 ) * USDbyDeSo;
    } else {
      USDValueAfterFees = inputValueAfterFees * USDbyDeSo;
    }
    amountObj.coinAmount = inputValue;
    amountObj.USDAmount = USDAmount;
    amountObj.coinAmountNanos = inputValue * 1e9;
    amountObj.receiveCoinAmount = inputValueAfterFees;
    amountObj.receiveUSDAmount = USDValueAfterFees;
    amountObj.trgFee = trgFee;

    return amountObj;
  }

  return {
    name: 'Send',
    controls: [
      {
        name: 'Recipient',
        component:  <InputBitcloutAccount
          placeholder={ "Username or Public Key"}
          validate={validateRecipient}
          user={user}
          htmlIds={{Recipient: "send_recipient_value", RecipientUsername: "send_recipientUsername_value"}}
          valueProp=''
        />,
        values: {
          Recipient: {id: 'send_recipient_value', required: false, type:'string'},
          RecipientUsername: {id: 'send_recipientUsername_value', required: false, type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Amount',
        component:  <InputAmount
          placeholder={ "Input amount in DeSo"}
          // currencyTypes={['$BitClouts', 'Coins']}
          megazordId={megazord.id}
          exchRate={bitcloutData.exchangeRate || {}}
          wallet={wallet}
          validate={validateCurrencies}
          feesMap={megazord.feesMap}        
          user={user}
          processAmount={processAmount}
          htmlIds={{
            AmountNanos: "send_Amount_value",
            Currency: "send_Currency_value",
            CreatorPublicKeyBase58Check: "send_CreatorPublicKeyBase58Check"}}
          valueProp=''
        />,
        values: {
          AmountNanos: {id: 'send_Amount_value', required: true, type: 'integer'},
          Currency: {id: 'send_Currency_value', required: true, type:'string'},
          CreatorPublicKeyBase58Check: {id: 'send_CreatorPublicKeyBase58Check', required: false, type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      }
    ],
    disabled: false
  }
}

const buy = (data) => {
  const {megazord, user, api_functions, bitcloutData, indexFunctons, taskState, setTaskState} = data;
  const validateRecipient = (account) => {
    let _taskState = {...taskState};
    if (!account || !account.id) {
      delete _taskState.account
      setTaskState(_taskState);
      throw Error('Creator not found.');
    }
    _taskState.account = account;
    setTaskState(_taskState);
    return true
  }
  const validateCurrencies = (currency) => {
    if (currency !== "$DESO" && wallet['$DESO'].BalanceNanos < 10000) {
      let errorMess = 'Top up your $DESO balance to cover transaction fees (~ $ 0.01 equivalent)';
      indexFunctons.notifSnak('open', 'error', errorMess, 7000);
      throw Error(errorMess);
    }
    return true;
  }
  const wallet =  {'$DESO': {BalanceNanos: megazord.BalanceNanos, CreatorPublicKeyBase58Check: ''}}
  const processAmount = (inputValue, currency) => {
    let account = taskState.account;
    if (!account) {
      throw Error('Creator not found.');
    }
    let founderReward = account.CoinEntry.CreatorBasisPoints / 100;
    let amountObj = {}
    let exchRate = bitcloutData.exchangeRate;
    let USDbyDeSo  = exchRate.USDbyDeSo;
    let USDAmount = inputValue * USDbyDeSo;
    var fees = Object.keys(megazord.feesMap).sort().reverse();
    var trgFee = fees[0];
    for (let fee of fees) {
      let range = megazord.feesMap[fee];
      if (USDAmount < range) {
        trgFee = parseFloat(fee);
        break
      }
    }
    let currentTokenPrice = account.CoinPriceBitCloutNanos / 1e9;
    let inputValueAfterFees = inputValue - (inputValue * (founderReward / 100)) - (inputValue * (trgFee / 100));
    let USDValueAfterFees = inputValueAfterFees * USDbyDeSo
    let coinsSupply = 10 * Math.sqrt(10/3) * Math.sqrt(currentTokenPrice);
    let DeSoLocked = 0.001 * coinsSupply**3;
    let newDeSoLocked = DeSoLocked + inputValueAfterFees;
    let newCoinsSupply =  10 * newDeSoLocked ** (1/3);
    let receiveCoinAmount =  newCoinsSupply - coinsSupply;

    amountObj.coinAmount = inputValue;
    amountObj.USDAmount = USDAmount;
    amountObj.coinAmountNanos = inputValue * 1e9;
    amountObj.receiveCoinAmount = receiveCoinAmount;
    amountObj.receiveUSDAmount = USDValueAfterFees;
    amountObj.trgFee = trgFee;
    amountObj.founderReward = founderReward;

    return amountObj;
  }

  return {
    name: 'Buy',
    controls: [
      {
        name: 'Creator',
        component:  <InputBitcloutAccount
          placeholder={ "Creator Username or Public Key"}
          validate={validateRecipient}
          user={user}
          htmlIds={{Recipient: "buy_creator_value", RecipientUsername: "buy_creatorUsername_value"}}
          valueProp=''
        />,
        values: {
          Creator: {id: 'buy_creator_value', required: false, type:'string'},
          CreatorUsername: {id: 'buy_creatorUsername_value', required: false, type:'string'}
        },
        disabled: false
      },

      {
        name: 'Amount',
        component:  <InputAmount
          placeholder={ "Input amount in DeSo"}
          // currencyTypes={['$BitClouts', 'Coins']}
          megazordId={megazord.id}
          exchRate={bitcloutData.exchangeRate || {}}
          wallet={wallet}
          validate={validateCurrencies}
          feesMap={megazord.feesMap}
          user={user}
          processAmount={processAmount}
          htmlIds={{
            AmountNanos: "invest_amount_value"}}
          valueProp=''
        />,
        values: {
          AmountNanos: {id: 'invest_amount_value', required: true, type: 'integer'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      }
    ],
    disabled: false
  }
}

const sell = (data) => {
  const {megazord, user, api_functions, bitcloutData, indexFunctons} = data;

  const validateRecipient = (account) => {
    if (!account) {
      throw Error('Account is undefined.');
    }
    return true
  }
  const validateCurrencies = (currency) => {
    if (currency !== "$DESO" && wallet['$DESO'].BalanceNanos < 10000) {
      let errorMess = 'Top up your $DESO balance to cover transaction fees (~ $ 0.01 equivalent)';
      indexFunctons.notifSnak('open', 'error', errorMess, 7000);
      throw Error(errorMess);
    }
    return true;
  }
  const getFee = (_amountNanos, CreatorPublicKeyBase58Check, reqId) => {
    return new Promise((resolve)=>{
      api_functions.getFee(_amountNanos, megazord.zords.map(z=>z.PublicKeyBase58Check), CreatorPublicKeyBase58Check)
        .then(data => {
          data.reqId = reqId;
          resolve(data);
        })
    })
  }
  const wallet = Object.assign(
    {'$DESO': {BalanceNanos: megazord.BalanceNanos, CreatorPublicKeyBase58Check: ''}},
    megazord.UsersYouHODL.reduce((reducer, it)=>{
      reducer[it.ProfileEntryResponse.Username] = {
        BalanceNanos: it.BalanceNanos,
        CreatorPublicKeyBase58Check: it.CreatorPublicKeyBase58Check,
        CoinPriceBitCloutNanos: it.ProfileEntryResponse.CoinPriceBitCloutNanos
      }
      return reducer
    }, {})
  )
  return {
    name: 'Send',
    controls: [
      {
        name: 'Recipient',
        component:  <InputBitcloutAccount
          placeholder={ "Username or Public Key"}
          validate={validateRecipient}
          user={user}
          htmlIds={{Recipient: "send_Recipient_value", RecipientUsername: "send_RecipientUsername_value"}}
          valueProp=''
        />,
        values: {
          Recipient: {id: 'send_Recipient_value', required: false, type:'string'},
          RecipientUsername: {id: 'send_RecipientUsername_value', required: false, type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Amount',
        component:  <InputAmount
          placeholder={ "Input amount in DeSo"}
          // currencyTypes={['$BitClouts', 'Coins']}
          megazordId={megazord.id}
          exchRate={bitcloutData.exchangeRate || {}}
          wallet={wallet}
          validate={validateCurrencies}
          feesMap={megazord.feesMap}
          getFee={getFee}
          user={user}
          htmlIds={{
            AmountNanos: "send_Amount_value",
            Currency: "send_Currency_value",
            CreatorPublicKeyBase58Check: "send_CreatorPublicKeyBase58Check"}}
          valueProp=''
        />,
        values: {
          AmountNanos: {id: 'send_Amount_value', required: true, type: 'integer'},
          Currency: {id: 'send_Currency_value', required: true, type:'string'},
          CreatorPublicKeyBase58Check: {id: 'send_CreatorPublicKeyBase58Check', required: false, type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      }
    ],
    disabled: false
  }
}

const repost = () => {
  return {
    name: 'Repost',
    controls: [
      {
        name: 'link',
        component:  <BitcloutPostLink
        htmlIds={{link: "link_to_post"}}
        label="Link to post"
        />,
        values: {
          link: {id: 'link_to_post', required: true, type:'string'}
        },
        possibleValue: "*",
        disabled: false
      },

    ],
    disabled: false,
  };
};
//Ordered dict
let taksMap = new Map();
taksMap.set('getPublicKey', getPublicKey);
taksMap.set('send', send);
taksMap.set('buy', buy);
// taksMap.set('sell', sell);
taksMap.set('repost', repost);
taksMap.set('updateProfile', updateProfile);

export default taksMap