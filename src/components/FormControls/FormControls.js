import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress'
// core components
import Button from "components/CustomButtons/Button.js";
import { api_functions} from '../../firebase_init';
import Avatar from '@material-ui/core/Avatar';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Tasks from "components/Tasks/Tasks.js";
import TasksMap from "../../controlsmap";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Icon from "@material-ui/core/Icon";
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTypography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Link from "@material-ui/core/Link";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { bugs, website, server } from "variables/general.js";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
  paper: {
   display: 'flex',
   justifyContent: 'space-evenly'
  },
  title: {
    textAlign: 'center'
  },
  formControl: {
    width:'100%',
    marginTop: theme.spacing(1),
    marginBottom: '26px'
  },
  currency: {
    display: 'flex',
    flexDirection: 'row'
  },
  wideInput: {
    width:'100%'
  },
  icon: {
    cursor: 'pointer',
    marginTop: '-3px',
    verticalAlign: 'middle'
  },
  success: {
    // borderRight: '5px solid green'
  },
  inputAccount: {
    marginBottom: '0px'
  },
  helper: {
    fontSize: '0.9rem'
  }
}));

export function BitcloutAccountItem({item, htmlIds, label, values}) {
  const ProfilePic = item.ProfilePic;
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="accountItem">{label}</InputLabel>
      <Input
        id="accountItem"
        startAdornment={
        <InputAdornment position="end">
          <Avatar style={{width: '28px', height: '28px', backgroundColor: '#ffffff00'}}>
            <img style={{width: '28px', height: '28px', objectFit: 'contain'}} src={ProfilePic}></img>
          </Avatar>
        </InputAdornment>}
        inputProps={{
          'aria-label': 'amount',
        }}
        disabled
        variant="outlined"
        defaultValue={values.Recipient}
      />
      {/* <Tooltip
        id="tooltip-top"
        title={Username}
        placement="top"
      >
        <Avatar style={{backgroundColor: '#fff'}}>
          <img style={{width: '4rem', height: '4rem', objectFit: 'contain'}} src={ProfilePic}></img>
        </Avatar>
      </Tooltip> */}
      <input type="hidden" id={htmlIds.Recipient} value={values.Recipient}></input>
    </FormControl>
    )
}
export function InputBitcloutAccount(
  {disabled=false, placeholder, valueProp, addHandler, onCloseSubscribe=()=>{}, user, validate,
  htmlIds={Recipient: "input_bitclout_account"}, ...rest }) {
  const classes = useStyles();
  const [inputState, setInputState] = React.useState(0);
  const [bitcloutAccount, setBitcloutAccount] = React.useState(null);
  const [sleepVar, setSleepVar] = React.useState(-1);
  const [value, setValue] = React.useState(valueProp);

  const inputOnChange = (event) => {
    setInputState(1);
    var inputAccount = event.target.value;
    setValue(inputAccount);
    clearTimeout(sleepVar);
    setBitcloutAccount(null);
    let _sleepVar = setTimeout(async () => {
      var [accName, PubKey] = ['', ''];
      if (inputAccount.startsWith('BC1') && inputAccount.length > 30) {
        PubKey = inputAccount;
      } else {
        accName = inputAccount;
      }
      if (!PubKey && !accName) {
        setInputState(3);
        return
      }
      try {
        var bitcloutAccountResp = await api_functions.getBitcloutAcc(PubKey, accName);
        bitcloutAccountResp.id = bitcloutAccountResp.PublicKeyBase58Check;
        validate(bitcloutAccountResp);
      } catch (err) {
        setInputState(3);
        return
      }
      setBitcloutAccount(bitcloutAccountResp);
      setInputState(2);
    }, 1000);

    setSleepVar(_sleepVar);
  }

  const _addHandler = (e) => {
    e.preventDefault();
    addHandler({...bitcloutAccount})
    setBitcloutAccount(null)
    clearTimeout(sleepVar);
    setValue('');
    setInputState(0);
  }

  onCloseSubscribe(() => {
    setValue('');
    setBitcloutAccount(null)
    clearTimeout(sleepVar);
    setInputState(0);
  })

  return (
    <FormControl className={classes.inputAccount + ' ' + classes.formControl}>
      <InputLabel htmlFor={'input_bitclout_account_control'}>{placeholder}</InputLabel>
      <Input
        error={(inputState === 3)}
        className={(inputState === 2) ? classes.success : ''}
        onChange={inputOnChange}
        disabled={disabled}
        value={value}
        id={'input_bitclout_account_control'}
        required
        endAdornment={
          <InputAdornment>
            {(inputState == 1 &&
              <CircularProgress size="1rem" style={{ color: primaryColor[0] }}></CircularProgress>
            )}
          </InputAdornment>
        }
        inputProps = {{
          "spellCheck": false,
          "aria-label": "BitClout account"
        }}
      />
      <FormHelperText component={'div'} id={'input_bitclout_account_helper_text'}
        style={{visibility: bitcloutAccount ? 'visible' : 'hidden'}} className={classes.helper}>
        {bitcloutAccount ? bitcloutAccount.PubKeyShort : 'Account Publick Key'}
      </FormHelperText>
      {((addHandler) &&
        <Button edge="end" size='sm'
        style={{visibility: (inputState == 2) ? 'visible' : 'hidden'}}
        onClick={_addHandler}
        round aria-label="add"
        color="primary" >
          Add
        </Button>
      )}
      <input type="hidden" id={htmlIds.Recipient} value={bitcloutAccount ? bitcloutAccount.id : ''}></input>
    </FormControl>
  )

}

export function InputAmount(props) {
  const classes = useStyles();
  const {htmlIds, exchRate, feesMap, wallet} = props;
  const currencyTypes = Object.keys(wallet).sort((a, b) => {return wallet[a] - wallet[b]});
  const [USDAmount, setUSDAmount] = React.useState(0);
  const [BTCLTAmount, setBTCLTAmount] = React.useState(0);
  const [amountNanos, setAmountNanos] = React.useState(0);
  const [MGZDfee, setMGZDFee] = React.useState(0);
  const [currency, setCurrency] = React.useState(currencyTypes[0]);

  var feesMapTable = '<table style="width:50%"><thead><td>USD value</td><td>Fee</td></thead>';
  var fees = Object.keys(feesMap).sort().reverse();
  for (let i = 0; i < fees.length; i += 1) {
    let fee = fees[i];
    let range = feesMap[fee];
    var rangeContent = '';
    if(isFinite(range)) {
      rangeContent = 'up to $' + range.toLocaleString();
    } else {
      rangeContent = 'more $'+feesMap[fees[i-1]].toLocaleString();
    }
    feesMapTable += '<tr><td>'+rangeContent+'</td><td>'+fee+'%</td></tr>'
  }
  feesMapTable += '</table>'

  const handleChange = (_BTCLTAmount) => {
    setBTCLTAmount(_BTCLTAmount);
    _BTCLTAmount = parseFloat(_BTCLTAmount || 0);
    if (exchRate.USDbyBTCLT) {
      var USDAmount = _BTCLTAmount * exchRate.USDbyBTCLT;
      setUSDAmount(USDAmount);
      var amountNanos = _BTCLTAmount * 1e9;
      setAmountNanos(amountNanos);
      var trgFee = fees[0];
      for (let fee of fees) {
        let range = feesMap[fee];
        if (USDAmount < range) {
          trgFee = fee;
          break
        }
      }
      setMGZDFee(trgFee);
    }
  }

  const maxHandler = (event) => {
    event.preventDefault();
    handleChange(wallet[currency] / 1e9);
  }

  const handleCurrencyChange = (event) => {
    event.preventDefault();
    setCurrency(event.target.value);
  }

  return (
  <div>
    <FormControl className={classes.formControl + ' ' + classes.currency}>
      <InputLabel id="currency-select-label">Currency</InputLabel>
      <Select
        labelId="currency-select-label"
        id="currency-select"
        value={currency}
        onChange={handleCurrencyChange}
      >
        {currencyTypes.map(item => {
          return (
            <MenuItem
              key={item}
              id={'currency_' + item}
              value={item}>{item}</MenuItem>)
      })}
      </Select>
    </FormControl>
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={'interact_amount'}>Amount of {currency} to send:</InputLabel>
      <Input
        id={'interact_interact_amount'}
        type="number"
        endAdornment={<Button onClick={maxHandler} size="sm">MAX</Button>}
        aria-describedby={'interact_amount_helper_text'}
        inputProps={{
          'aria-label': 'amount',
        }}
        onChange={e => handleChange(e.target.value)}
        required
        placeholder={BTCLTAmount.toLocaleString()}
        value={BTCLTAmount ? BTCLTAmount : ''}
      />
      <FormHelperText component={'div'} id={'interact_amount_helper_text'} className={classes.helper}>
        <div>
          <div>
          Platform fee: {MGZDfee}%
          <Tooltip
            id="tooltip-top"
            title={<div dangerouslySetInnerHTML={{
              __html: `Platform Fees included in total transaction amount and depending of USD value:${feesMapTable}
                <i>NOTE:The USD value is calculated at the time of the task execution.</i>`
            }}></div>}
            placement="right"
          >
            <Icon className={classes.icon} fontSize="small">info</Icon>
          </Tooltip>
          </div>
          <div>
            Will receive: {BTCLTAmount - BTCLTAmount * (MGZDfee / 100).toFixed(4).toLocaleString()} (≈ ${USDAmount.toFixed(2).toLocaleString()} USD)
          </div>
        </div>
      </FormHelperText>
    </FormControl>
    <input type="hidden" value={amountNanos} id={htmlIds.AmountNanos || 0}></input>
    <input type="hidden" value={currency} id={htmlIds.Currency}></input>
  </div>)
}

export function Description(porps) {
  return ( <TextField
    id="standard-multiline-static"
    label="Multiline"
    multiline
    rows={4}
    defaultValue="Default Value"
    onInput = {(e) =>{
      e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0, porps.maxLength)
    }}
  />)
}


export function UploadImage(props) {
  return (<div></div>)
}

export function FounderReward(props) {
  return (<div></div>)
}

export default {}