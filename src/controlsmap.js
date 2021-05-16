import React from "react";
import {InputBitcloutAccount, InputAmount, BitcloutAccountItem} from "components/FormControls/FormControls";

// const InputBitcloutAccount = FormControls.InputBitcloutAccount;

// SenderPublicKeyBase58Check,
// RecipientPublicKeyOrUsername,
// AmountNanos,
const getPublicKey = (data) => {
  const megazord = data.megazord;
  const user = data.user;
  megazord.Username = 'Traget Megazrod'
  return {
    controls: [
      {
        name: 'Recipient',
        component: <BitcloutAccountItem item={megazord}/>,
        possibleValue: megazord.Username || megazord.PubKeyShort || "TargetMegazord",
        // possibleInputType: ['Current Account'],
        disabled: true
      }
    ],
    disabled: false,
    order: 0
  }
}

const updateProfile = (user) => {
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
    order: 1
  }
}

const send = (user) => {
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
    order: 2
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