import React from "react";
import {
  InputBitcloutAccount,
  InputAmount,
  BitcloutAccountItem,
  Description,
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
    controls: [
      {
        name: 'Recipient',
        component: <BitcloutAccountItem
          id='get_public_key_recipient'
          item={megazord}
          label={'Recipient'}
          value={megazord.Username || megazord.PubKeyShort || "TargetMegazord"}/>,
        possibleValue: megazord.Username || megazord.PubKeyShort || "TargetMegazord",
        // possibleInputType: ['Current Account'],
        disabled: true
      }
    ],
    disabled: false,
    order: 0
  }
}

const updateProfile = (data) => {
  const {megazord, user, api_functions} = data;
  megazord.Username = 'Traget Megazrod'
  const postfix = '\n@mgzd'
  const validateRecipient = (account) => {
    if (account.id === user.id) {
      throw Error('Cant send to self Megazord.');
    }
    return true
  }
  const validateUsername = (account) => {
    if (account.id) {
      throw Error('Cant send to self Megazord.');
    }
    return true
  }

  return {
    controls: [
      {
        name: 'Recipient',
        component: <BitcloutAccountItem item={megazord}/>,
        possibleValue: megazord.Username || megazord.PubKeyShort || "TargetMegazord",
        // possibleInputType: ['Current Account'],
        disabled: true
      },
      {
        name: 'Username',
        component:  <InputBitcloutAccount
          placeholder={ "Input Name or Public Key"}
          validate={validateUsername}
          user={user}
          htmlId="update_name_id"
          valueProp={megazord.Username || ''}
        />,
        possibleValue: "*",
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Description',
        component:  <Description
          placeholder={"Bitclout Account Description"}
          maxLength={280 - postfix.length}
          postfix={postfix}
          user={user}
          htmlId="update_name_id"
          valueProp={megazord.Description || ''}
        />,
        possibleValue: "*",
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Avatar',
        component:  <UploadImage
          maxSize="1mb"
          user={user}
          htmlId="updload_avatar_id"
          valueProp={megazord.ProfilePic}
        />,
        possibleValue: "*",
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Founder Reward Percentage',
        component:  <FounderReward
          htmlId="founder_reward_id"
          valueProp={megazord.ProfilePic}
        />,
        possibleValue: "*",
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Task Description',
        component:  <Description
          placeholder={"Task  Description"}
          maxLength={1000}
          postfix={postfix}
          user={user}
          htmlId="update_name_id"
          valueProp={megazord.Description || ''}
        />,
        possibleValue: "*",
        // possibleInputType: ['Current Account'],
        disabled: false
      }
    ],
    disabled: false,
    order: 2
  }
}

const send = (data) => {
  const {megazord, user, api_functions, exchangeRate} = data;
  megazord.Username = 'Traget Megazrod'
  const validateRecipient = (account) => {
    if (account.id === user.id) {
      throw Error('Cant send to self Megazord.');
    }
    return true
  }
  return {
    controls: [
      {
        name: 'Recipient',
        component:  <InputBitcloutAccount
          placeholder={ "Username or Public Key"}
          validate={validateRecipient}
          user={user}
          htmlId="send_recipient_id"
          valueProp=''
        />,
        possibleValue: "*",
        // possibleInputType: ['Current Account'],
        disabled: false
      },
      {
        name: 'Amount',
        component:  <InputAmount
          placeholder={ "Input amount in BitClout"}
          exchRate={exchangeRate}
          feesMap={api_functions.getFeesMap()}
          currency='BitCLout'
          user={user}
          htmlId="send_amount"
          valueProp=''
        />,
        possibleValue: "*",
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
  send,
  buy,
  sell
}