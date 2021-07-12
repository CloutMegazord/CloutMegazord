import React from "react";
import {
  InputBitcloutAccount,
  InputAmount,
  BitcloutAccountItem,
  Description,
  UploadFile,
  FounderReward,
  UploadImage} from "components/FormControls/FormControls";

// const InputBitcloutAccount = FormControls.InputBitcloutAccount;

// SenderPublicKeyBase58Check,
// RecipientPublicKeyOrUsername,
// AmountNanos,
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
    disabled: false,
    order: 0
  }
}

const updateProfile = (data) => {
  const {megazord, user, indexFunctons, bitcloutData, api_functions} = data;
  const postfix = '\n@mgzd'
  const validateUsername = (account) => {
    if (account) {
      indexFunctons.notifSnak('open', 'error', 'Name already used', 2000);
      throw Error('Cant send to self Megazord.');
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
    if (fileToUpload.size > 5 * 1024 * 1024) {
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
         (bitcloutData.appState.CreateProfileFeeNanos / 1e9 * bitcloutData.exchangeRate.USDbyBTCLT + 0.1)
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
          htmlIds={{RecipientUsername: "send_RecipientUsername_value"}}
          valueProp=''
        />,
        values: {
          RecipientUsername: {id: 'send_RecipientUsername_value', required: true, type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'NewDescription',
        component:  <Description
          label={"Bitclout Account Description"}
          htmlIds={{Description: "updateProfile_Description_value"}}
          maxLength={280 - postfix.length}
          postfix={postfix}
          user={user}
          valueProp={megazord.Description || ''}
        />,
        values: {
          RecipientUsername: {id: 'updateProfile_Description_value', required: false, type:'string'}
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
          globalIds={{Avatar: "updateProfile_avatar"}}
          valueProp={megazord.ProfilePic}
          loadFile={api_functions.loadFile}
        />,
        //get from window object
        values: {
          RecipientUsername: {globalName: 'updateProfile_avatar',
          required: megazord.ProfilePic === api_functions.defaultAvatar,//required
          type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'founderRewardInput',
        component:  <FounderReward
        htmlIds={{FR: "updateProfile_FR"}}
          valueProp={megazord.ProfilePic}
        />,
        values: {
          RecipientUsername: {id: 'updateProfile_FR', required: true, type:'float'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      }
    ],
    disabled: false,
    order: 2
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
    if (currency !== "$ClOUT" && wallet['$ClOUT'].BalanceNanos < 100000) {
      indexFunctons.notifSnak('open', 'error', 'Top up your $CLOUT balance to cover transaction fees (~ $ 1 equivalent)', 7000);
      throw Error('Top up your $CLOUT balance to cover transaction fees (~ $ 1 equivalent)');
    }
    return true;
  }
  const wallet = Object.assign(
    {'$ClOUT': {BalanceNanos: megazord.BalanceNanos, CreatorPublicKeyBase58Check: ''}},
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
          Recipient: {id: 'send_Recipient_value', required: true, type:'string'},
          RecipientUsername: {id: 'send_RecipientUsername_value', required: true, type:'string'}
        },
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Amount',
        component:  <InputAmount
          placeholder={ "Input amount in BitClout"}
          // currencyTypes={['$BitClouts', 'Coins']}
          megazordId={megazord.id}
          exchRate={bitcloutData.exchangeRate}
          wallet={wallet}
          validate={validateCurrencies}
          feesMap={api_functions.getFeesMap()}
          getFee={api_functions.getFee}
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
    disabled: false,
    order: 1
  }
}

const buy = (user) => {
  return {
    controls: [
      {
        name: 'Recipient',
        component: InputBitcloutAccount,
        possibleValue: '*',
        possibleInputType: ['UserName', 'PublicKey']
      },
      {
        name: 'Amount',
        component: InputAmount,
        possibleValue: '*',
        possibleInputType: ['BTCLT', 'Coins']
      }
    ],
    disabled: true,
    order: 3
  }
}

const sell = (user) => {
  return {
    controls: [
      {
        name: 'Recipient',
        component: InputBitcloutAccount,
        possibleValue: '*',
        possibleInputType: ['UserName', 'PublicKey']
      },
      {
        name: 'Amount',
        component: InputAmount,
        possibleValue: '*',
        possibleInputType: ['BTCLT', 'Coins']
      }
    ],
    disabled: true,
    order: 4
  }
}


export default {
  getPublicKey,
  updateProfile,
  send: send,
  // buy,
  // sell
}