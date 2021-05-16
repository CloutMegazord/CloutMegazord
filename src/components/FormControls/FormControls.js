import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress'
// core components
import Button from "components/CustomButtons/Button.js";
import { api_functions} from '../../firebase_init';
import Avatar from '@material-ui/core/Avatar';
import Input from "components/CustomInput/CustomInput.js"
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
// import Input from "components/CustomInput/CustomInput.js"
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Tasks from "components/Tasks/Tasks.js";
import TasksMap from "../../controlsmap";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Icon from "@material-ui/core/Icon";
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import IconButton from "@material-ui/core/Icon";
import DeleteIcon from '@material-ui/icons/Delete';
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

}));

export function InputAmount(props) {
  const classes = useStyles();
}

export function BitcloutAccountItem({item, id, value}) {
  const ProfilePic = item.ProfilePic;
  const Username = item.Username;
  return (
    <FormControl>
      <Tooltip
        id="tooltip-top"
        title={Username}
        placement="top"
      >
        <Avatar style={{backgroundColor: '#fff'}}>
          <img style={{width: '4rem', height: '4rem', objectFit: 'contain'}} src={ProfilePic}></img>
        </Avatar>
      </Tooltip>
      {/* <input type="hidden" id={id} value={value}></input> */}
    </FormControl>
    )
}

export function InputBitcloutAccount(props) {
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

export default {}