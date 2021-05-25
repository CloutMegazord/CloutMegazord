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
    margin: theme.spacing(1)
  },
  wideInput: {
    width:'100%'
  },
  icon: {
    cursor: 'pointer',
    marginTop: '-3px',
    verticalAlign: 'middle'
  }
}));

export function BitcloutAccountItem({item, id, label, value}) {
  const ProfilePic = item.ProfilePic;
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <Input
        id={id}
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
        defaultValue={value}
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
      <input type="hidden" id={id} value={value}></input>
    </FormControl>
    )
}
export function InputBitcloutAccount(
  {disabled=false, placeholder, valueProp, addHandler, onCloseSubscribe=()=>{}, user, validate,
  htmlId='input_bitclout_account', ...rest }) {
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
        bitcloutAccountResp.id = bitcloutAccount.PublicKeyBase58Check;
        validate(bitcloutAccountResp);
      } catch (err) {
        setInputState(3);
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
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={htmlId}>{placeholder}</InputLabel>
      <Input
        error={(inputState === 3)}
        success={(inputState === 2).toString()}
        onChange={inputOnChange}
        disabled={disabled}
        value={value}
        endAdornment={
          <InputAdornment position="end">
            {(inputState == 1 &&
              <CircularProgress size="1rem" style={{ color: primaryColor[0] }}></CircularProgress>
            )}
          </InputAdornment>
        }
        id={htmlId}
        inputProps = {{
          "aria-label": "BitClout account"
        }}
      />

      {((inputState == 2 && addHandler) &&
        <Button edge="end" size='sm' onClick={_addHandler} round aria-label="add" color="primary" >
          Add
        </Button>
      )}
    </FormControl>
  )

}

export function InputAmount(props) {
  const classes = useStyles();
  const [USDAmount, setUSDAmount] = React.useState(0);
  const [BTCLTAmount, setBTCLTAmount] = React.useState(0);
  const [nanosAmount, setNanosAmount] = React.useState(0);
  const [MGZDfee, setMGZDFee] = React.useState(0);
  const {htmlId, getExchangeRate, feesMap, exchRate} = props;
  //SatoshisPerBitCloutExchangeRate
  //USDCentsPerBitcoinExchangeRate
  var feesMapTable = '<table style="width:100%"><thead><td>Amount</td><td>Fee</td></thead>';
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
  const handleChange = (event) => {
    // var exchangeRate =  (ticker.USD.last / 100) * (exchangeRate.SatoshisPerBitCloutExchangeRate / 100000000)
    // setBTCLTAmount(event.target.value);
    // if (exchRate.USDbyBTCLT) {
    //   var USDAmount = BTCLTAmount * exchRate.USDbyBTCLT;
    //   setUSDAmount(USDAmount);
    //   var nanosAmount = BTCLTAmount * 1e-9;
    //   setNanosAmount(nanosAmount);
    //   var trgFee = 0;
    //   for (let fee in feesMap) {
    //     let range = feesMap[fee];
    //     if (USDAmount < range) {
    //       trgFee = fee;
    //     } else {break}
    //   }
    //   setMGZDFee(trgFee);
    // }
  }
  // placeholder={ "Input Name or Public Key"}
  // validate={validateUsername}
  // user={user}
  // htmlId="update_name_id"
  // valueProp={megazord.Username || ''}
    // InputLabelProps={{
      //   shrink: true,
  // }}
  //helperText={USDAmount ? `USD ≈ ${USDAmount}` : '1'}
  return (
  <div>
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={'interact_' + htmlId}>Amount of $BitClout to send:</InputLabel>
      <Input
        id={'interact_' + htmlId}
        type="number"
        // endAdornment={<InputAdornment position="end">$BitClout</InputAdornment>}
        aria-describedby={htmlId + '_helper_text'}
        inputProps={{
          'aria-label': 'amount',
        }}
        onChange={handleChange}
        value={BTCLTAmount}
      />
      <FormHelperText id={htmlId + '_helper_text'}>
        Platform fee: {MGZDfee}%
        <Tooltip
          id="tooltip-top"
          title={<div dangerouslySetInnerHTML={{
            __html: `Platform Fees included in Total and depending of amount:${feesMapTable}`
          }}></div>}
          placement="right"
        >
          <Icon className={classes.icon} fontSize="small">info</Icon>
        </Tooltip>
        <br/>
        Total: {BTCLTAmount + BTCLTAmount * (MGZDfee / 100)} (≈ ${USDAmount.toLocaleString} USD)
      </FormHelperText>
    </FormControl>
    <input type="hidden" value={nanosAmount}></input>
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