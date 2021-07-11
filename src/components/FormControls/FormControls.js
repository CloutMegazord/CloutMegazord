import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress'
// core components
import Button from "components/CustomButtons/Button.js";
import { api_functions} from '../../firebase_init';
import Avatar from '@material-ui/core/Avatar';
import Fab from "@material-ui/core/Fab";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Tasks from "components/Tasks/Tasks.js";
import TasksMap from "../../controlsmap";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Icon from "@material-ui/core/Icon";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
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
  uploadWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  imgPreview: {
    '& img': {
      maxWidth: '100%',
      maxHeight: '100%'
    },
    overflow: 'hidden',
    borderRadius: '100%',
    height: '60px'
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
        setBitcloutAccount({id:PubKey});
        setInputState(2);
        return
      } else {
        accName = inputAccount;
      }
      if (!PubKey && !accName) {
        setInputState(3);
        return
      }
      try {
        var bitcloutAccountResp = await api_functions.getBitcloutAcc(PubKey, accName);
        validate(bitcloutAccountResp);
      } catch (err) {
        console.log(err);
        setInputState(3);
        return
      }
      if(!bitcloutAccountResp) {
        bitcloutAccountResp = {
          Username:accName
        }
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
      {htmlIds.Recipient &&
        <FormHelperText component={'div'} id={'input_bitclout_account_helper_text'}
          style={{visibility: bitcloutAccount ? 'visible' : 'hidden'}} className={classes.helper}>
          {bitcloutAccount ? bitcloutAccount.PubKeyShort : 'Account Publick Key'}
        </FormHelperText>
      }
      {((addHandler) &&
        <Button edge="end" size='sm'
        style={{visibility: (inputState == 2) ? 'visible' : 'hidden'}}
        onClick={_addHandler}
        round aria-label="add"
        color="primary" >
          Add
        </Button>
      )}
      {htmlIds.Recipient &&
        <input type="hidden" id={htmlIds.Recipient} value={bitcloutAccount ? bitcloutAccount.PublicKeyBase58Check : ''}></input>
      }
      {htmlIds.RecipientUsername &&
        <input type="hidden" id={htmlIds.RecipientUsername} value={bitcloutAccount ? bitcloutAccount.Username : ''}></input>
      }
    </FormControl>
  )
}

export function InputAmount(props) {
  const classes = useStyles();
  const {htmlIds, exchRate, feesMap, wallet, validate, megazordId, getFee} = props;
  const currencyTypes = Object.keys(wallet).sort((a, b) => {return wallet[a].BalanceNanos - wallet[b].BalanceNanos}).reverse();
  const [USDAmount, setUSDAmount] = React.useState(0);
  const [BTCLTAmount, setBTCLTAmount] = React.useState(0);
  const [amountNanos, setAmountNanos] = React.useState(0);
  const [MGZDfee, setMGZDFee] = React.useState(null);
  const [currency, setCurrency] = React.useState('$ClOUT');

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

  const handleChange = (_Amount) => {
    setMGZDFee(null);
    setBTCLTAmount(_Amount);
    _Amount = parseFloat(_Amount || 0);
    if (exchRate.USDbyBTCLT) {
      var _amountNanos = _Amount * 1e9;
      setAmountNanos(_amountNanos);
      let CreatorPublicKeyBase58Check;
      if (wallet[currency].CreatorPublicKeyBase58Check) {
        CreatorPublicKeyBase58Check = wallet[currency].CreatorPublicKeyBase58Check;
      }
      getFee(_amountNanos, megazordId, CreatorPublicKeyBase58Check).then(({feePercent}) => {
        setMGZDFee(feePercent);
        let _USDAmount
        if (wallet[currency].CoinPriceBitCloutNanos) {
          let CoinPriceBitCloutNanos = wallet[currency].CoinPriceBitCloutNanos;
          _USDAmount = _Amount * (CoinPriceBitCloutNanos / 1e9 ) * exchRate.USDbyBTCLT;
        } else {
          _USDAmount = _Amount * exchRate.USDbyBTCLT
        }
        setUSDAmount(_USDAmount);
      });
    }
  }

  const maxHandler = (event) => {
    event.preventDefault();
    handleChange(wallet[currency].BalanceNanos / 1e9);
  }

  const handleCurrencyChange = (event) => {
    event.preventDefault();
    try {
      validate(event.target.value)
    } catch (e) {
      return
    }
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
          CloutMegazord fee: {MGZDfee !== null ? MGZDfee + "%" : 'Waiting'}
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
            Will receive: {(BTCLTAmount - BTCLTAmount * ((MGZDfee || 0) / 100)).toFixed(4).toLocaleString()}{" "}
            (≈ ${(USDAmount - USDAmount  * ((MGZDfee || 0) / 100)).toFixed(2).toLocaleString()} USD)
          </div>
          <div>
            Fee: { (BTCLTAmount * ((MGZDfee || 0) / 100)).toFixed(4).toLocaleString()}{" "}
            (≈ ${(USDAmount* ((MGZDfee || 0) / 100)).toFixed(2).toLocaleString()} USD)
          </div>
        </div>
      </FormHelperText>
    </FormControl>
    <input type="hidden" value={amountNanos} id={htmlIds.AmountNanos || 0}></input>
    <input type="hidden" value={currency} id={htmlIds.Currency}></input>
    <input type="hidden" value={wallet[currency].CreatorPublicKeyBase58Check} id={htmlIds.CreatorPublicKeyBase58Check}></input>
  </div>)
}

export function Description(porps) {
  const classes = useStyles();
  const {postfix, label, valueProp, htmlIds} = porps;
  const [value, setValue] = React.useState(valueProp);
  const onInputHandler = (e) => {
    e.preventDefault();
    setValue(e.target.value.slice(0, porps.maxLength))
  }
  return (
    <FormControl className={classes.formControl}>
      <TextField
        id="description"
        label={label}
        multiline
        value={value}
        inputProps = {{
          "spellCheck": false
        }}
        rows={4}
        onInput = {onInputHandler}/>
      <FormHelperText component={'div'} id={'description_helper_text'} className={classes.helper}>
        {value.length} / {porps.maxLength} <br/>
        "{postfix}" - postfix would be added to end of description by default.
      </FormHelperText>
      <input type="hidden" value={value} id={htmlIds.Description}/>
    </FormControl>
  )
}


export function UploadFile(props) {
  const {valueProp, globalIds, validate} = props;
  const classes = useStyles();
  const [filePreview, setFilePreview] = React.useState(valueProp);
  const handleUploadClick = (e) => {
    const files = e.target.files;
    let fileToUpload = files.item(0);
    try {
      validate(fileToUpload)
    } catch (e) {
      return
    }
    const reader = new FileReader();
    reader.readAsBinaryString(fileToUpload);
    reader.onload = (event) => {
      const base64Image = btoa(event.target.result);
      window[globalIds.Avatar] = `data:${fileToUpload.type};base64,${base64Image}`;
      setFilePreview(window[globalIds.Avatar]);
    };
  }
  return (
    <FormControl className={classes.formControl}>
     <FormHelperText component={'div'} id={'description_helper_text'} className={classes.helper}>
        Change Avatar
      </FormHelperText>
      <div className={classes.uploadWrapper}>
        <input
          accept="image/*"
          className={classes.input}
          id="contained-button-file"
          multiple
          hidden
          type="file"
          onChange={handleUploadClick}
        />
         <label htmlFor="contained-button-file" style={{marginRight: 20}}>
          <Fab component="span" className={classes.button}>
            <AddPhotoAlternateIcon />
          </Fab>
        </label>
        <div className={classes.imgPreview}>
          <img src={filePreview}></img>
        </div>
      </div>
    </FormControl>
  )
}

export function FounderReward(props) {
  const {valueProp, htmlIds} = props;
  const classes = useStyles();
  const [value, setValue] = React.useState(valueProp);
  const onInputHandler = (e) => {
    e.preventDefault();
    if (!e.target.value) {
      setValue('');
      return
    }
    let val = parseFloat(e.target.value);
    if (val > 100 || val < 0) {
      return
    }
    setValue(val)
  }
  return (
    <FormControl className={classes.formControl}>
    <TextField
      id="FR"
      label="Founder Reward Percentage"
      type="number"
      value={value}
      InputProps={{ inputProps: { min: 0, max: 100 } }}
      InputLabelProps={{
        shrink: true,
      }}
      onInput = {onInputHandler}
    />
    <input type="hidden" value={value} id={htmlIds.FR}/>
  </FormControl>
  )
}

export default {}