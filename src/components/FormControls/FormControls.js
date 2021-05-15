import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress'
// core components
import Button from "components/CustomButtons/Button.js";
import { api_functions} from '../../firebase_init';
import Input from "components/CustomInput/CustomInput.js"
import {
  grayColor,
  primaryColor,
  secondaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  roseColor,
  whiteColor,
  blackColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";


const useStyles = makeStyles((theme) => ({

}));
function InputAmount(props) {
  const classes = useStyles();
}

function InputBitcloutAccount(props) {
  const classes = useStyles();
  const [inputState, setInputState] = React.useState(0);
  const { disabled, placeholder, valueProp, addHandler, onCloseSubscribe, user, validate, ...rest } = props;
  const [bitcloutAccount, setBitcloutAccount] = React.useState(null);

  const [sleepVar, setSleepVar] = React.useState(-1);
  const [value, setValue] = React.useState(valueProp);

  const inputOnChange = (event) => {
    setInputState(1);
    var inputAccount = event.target.value;
    setValue(inputAccount);
    clearTimeout(sleepVar);
    let _sleepVar = setTimeout(() => {
      api_functions.getBitcloutAcc('', inputAccount).then(bitcloutAccount => {
        bitcloutAccount.id = bitcloutAccount.PublicKeyBase58Check;
        try {
          validate(bitcloutAccount);
        } catch (err) {
          throw err;
        }
        setBitcloutAccount(bitcloutAccount);
        setInputState(2);
      }).catch(err => {
        setInputState(3);
      })
    }, 1000);
    setSleepVar(_sleepVar);
  }

  const _addHandler = (e) => {
    e.preventDefault();
    addHandler({...bitcloutAccount})
    setValue('');
    setInputState(0);
  }

  onCloseSubscribe(() => {
    setValue('');
    setInputState(0);
  })

  return (
    <div>
      <Input
        error={inputState === 3}
        success={inputState === 2}
        onChange={inputOnChange}
        formControlProps={{
          className: classes.margin
        }}
        disabled={disabled}
        value={value}
        inputProps={{
          placeholder: placeholder,
          inputProps: {
            "aria-label": "BitClout account"
          }
        }}
      />
      {(inputState == 1 &&
        <CircularProgress size="1rem" style={{ color: primaryColor[0] }}></CircularProgress>
      )}
      {(inputState == 2 &&
        <Button edge="end" size='sm' onClick={_addHandler} round aria-label="add" color="primary" >
          Add
        </Button>
      )}
    </div>
  )

}

export default {
  InputBitcloutAccount
}
