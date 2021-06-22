import React from "react";
import classNames from "classnames";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/Icon";
import DeleteIcon from '@material-ui/icons/Delete';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import Box from '@material-ui/core/Box';
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import CircularProgress from '@material-ui/core/CircularProgress'
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Link from "@material-ui/core/Link";
import MuiTypography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// core components
import Button from "components/CustomButtons/Button.js";
import Fab from "components/CustomFab/Fab.js"
import Input from "components/CustomInput/CustomInput.js"
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {InputBitcloutAccount} from "components/FormControls/FormControls";
// import FormControls from "components/FormControls/FormControls.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";



// import Typography from 'components/Typography';
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CardAvatar from "components/Card/CardAvatar.js";
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
  hexToRgb,
  defaultFont
} from "assets/jss/material-dashboard-react.js";

import { bugs, website, server } from "variables/general.js";
import CryptoLib from "../../crypto";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import avatar from "assets/img/faces/marc.jpg";


var nameThisColor = require('name-this-color');
const useStyles = makeStyles(styles);

function makeid(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *
charactersLength)));
 }
 return result.join('');
}

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const useMegazordStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: '80%',
    maxHeight: 535,
  },
  shadow: {boxShadow:
    "0 3px 3px -4px rgba(" +
    hexToRgb(blackColor) +
    ", 0.42), 0 2px 3px 0px rgba(" +
    hexToRgb(blackColor) +
    ", 0.12), 0 2px 3px -3px rgba(" +
    hexToRgb(blackColor) +
    ", 0.2)"
  }
}));

function SeedPhraseDialog(props) {
  const { onConfirm, onClose, open, user, zordId, api_functions, ...other } = props;
  const classes = useMegazordStyles();
  const seedPhrase = CryptoLib.createSeedPhrase();

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase)
  }

  const onFinish = () => {
    var seedElement = document.querySelector("#seedPhrase");
    seedElement.innerText = '';
  }

  const handleOk = () => {
    onConfirm(zordId);
  };

  const handleCancel = () => {
    onFinish();
    onClose();
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      transitionDuration={0}
      aria-labelledby="dialog-title"
      classes={{
        paper: classes.paper,
      }}
      open={open}
      {...other}
    >
        <DialogTitle id="dialog-title"> Store Zord forever password</DialogTitle>
        <DialogContent dividers>
          <Warning variant="body1" align="left">

          </Warning>
          <MuiTypography style={{color:warningColor[0]}}>
            If you lose your seed phrase your account will be lost forever.
          </MuiTypography>
          <Tooltip
            id="tooltip-top"
            title={<div style={{
              fontSize:'16px', padding:"4px", lineHeight:"18px"}}
            dangerouslySetInnerHTML={{
              __html: "You also can use any BIP39 Bitcoin mnemonic generator like " +
              " Ian Coleman bip39 generator" +
              " or just use generator on " +
              " BitClout Sign-Up page." +
              " <br>Main restriction: seed pharese should include exactly <b style='color:"+dangerColor[0]+"'>12</b> words!" }}></div>}
            placement="top"
            interactive
          >
            <b style={{cursor:'pointer', fontSize:'16px', color:primaryColor[0]}}>Advanced</b>
          </Tooltip>
          <MuiTypography className={classes.shadow} id="seedPhrase" style={{padding: "1em", margin: "1rem"}}>
            {seedPhrase}
          </MuiTypography>
          {/* <Info color="inherit" variant="body1" align="left">
              {seedPhrase}
          </Info> */}
       </DialogContent>
       <DialogActions>
        <Button autoFocus onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button autoFocus onClick={handleCopy} color="primary">
          Copy
        </Button>
        <Button onClick={handleOk} color="secondary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function CreateMegazord(props) {
  const { onCreate, onClose, value: valueProp, open, user, ...other } = props;
  const [accounts, setAccounts] = React.useState([]);

  const radioGroupRef = React.useRef(null);
  const classes = useMegazordStyles();
  var closeSubscriber;

  const onFinish = () => {
    setAccounts([])
    closeSubscriber();
  }

  const handleCancel = () => {
    onFinish();
    onClose();
  };

  const handleOk = () => {
    onFinish();
    onCreate([...accounts]);
  };

  const validate = (bitcloutAccount) => {
    if ([...accounts, user].some(it => it.id === bitcloutAccount.id)) {
      throw Error('Account alredy exists.');
    }
    return true
  }

  const addToList = (bitcloutAccount) => {
    setAccounts([...accounts, bitcloutAccount]);
  }

  const removeFromList = (e, id) => {
    e.preventDefault();
    var _accounts = [...accounts].filter(it => it.id !== id);
    setAccounts(_accounts);
  }

  const onCloseSubscribe = (onClose => {
    closeSubscriber = onClose;
  });

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="dialog-title"
      classes={{
        paper: classes.paper,
      }}
      open={open}
      {...other}
    >
      <DialogTitle id="dialog-title">Create new Megazord</DialogTitle>
      <DialogContent dividers>
        <InputBitcloutAccount
          disabled={accounts.length > 2}
          placeholder={(accounts.length > 2) ? "Limit reached" : "Invite BitClout User as Zord for new Megazord"}
          addHandler={addToList}
          onCloseSubscribe={onCloseSubscribe}
          htmlIds={{Recipient: "add_Zord_value"}}
          validate={validate}
          user={user}
          valueProp=''
        />
        <p className={classes.cardCategory}>Zords (Max 4):</p>
        <List>
          <ListItem key={user.id} disabled>
            <ListItemAvatar>
              <Avatar style={{backgroundColor: '#fff'}}>
                <img style={{width: '2rem', height: '2rem', objectFit: 'contain'}} src={user.ProfilePic}></img>
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{user.Username || user.id}</ListItemText>
          </ListItem>
          {accounts.map(item => {
              return (
                <ListItem key={item.id}>
                  <Link target="_blank" href={"https://bitclout.com/u/" + item.Username}>
                    <ListItemAvatar>
                      <Avatar style={{backgroundColor: '#fff', width: '2rem', height: '2rem'}} alt={item.Username || item.id}
                           src={item.ProfilePic}>
                        {/* <img style={{width: '2rem', height: '2rem', objectFit: 'contain'}} src={item.avatar}></img> */}
                      </Avatar>
                    </ListItemAvatar>
                  </Link>
                  <ListItemText>{item.Username}</ListItemText>
                  <ListItemSecondaryAction>
                      <IconButton onClick={e=>removeFromList(e, item.id)} edge="end"
                        aria-label="delete" style={{color:primaryColor[0], cursor: 'pointer'}}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
          )})}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="secondary"
          disabled={accounts.length < 1}>
          {accounts.length < 1 ? 'Min 2 Zords' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles2 = makeStyles(theme => ({
  notifications: {
    zIndex: "4",
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      top: "-3px",
      border: "1px solid " + whiteColor,
      right: "-8px",
      fontSize: "12px",
      background: secondaryColor[0],
      color: blackColor,
      minWidth: "24px",
      height: "24px",
      borderRadius: "24px",
      textAlign: "center",
      lineHeight: "24px",
      verticalAlign: "middle",
      display: "block"
    },
    [theme.breakpoints.down("sm")]: {
      ...defaultFont,
      fontSize: "14px",
      marginRight: "8px"
    }
  },
  colorId: {
    position: 'absolute',
    left:'5%',
    top: '25px',
    borderRadius: "100%",
    // backgroundColor: 'red',
    border: '2px solid #f4f4f4',
    boxShadow: '0px 0px 0px 1px #d5d5d5',
    width: '25px',
    height: '25px'
  },
  hideMegazord: {
    color: grayColor[0],
    position: 'absolute',
    right:'5%',
    top: '25px',
    cursor: 'pointer',
    '&:hover': {
      color: primaryColor[0]
    }
  }
}));

function getCoinsTable(UsersYouHODL) {
  return (<div>
      {UsersYouHODL.length ? (
      <Table>
        <TableBody>
        {UsersYouHODL.map(hodl => (
            <TableRow key={hodl.ProfileEntryResponse.Username}>
              <TableCell style={{color:'#fff'}}>{hodl.ProfileEntryResponse.Username}</TableCell>
              <TableCell style={{color:'#fff'}}>{parseFloat((hodl.BalanceNanos / 1e9))}</TableCell>
            </TableRow>
          )
        )}
        </TableBody>
      </Table>):
      (<div>No Creator Coins yet.</div>)}
    </div>)
}

function adjust(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default function MegazordsList(props) {
  const classes = Object.assign(useStyles(), useStyles2());
  const [open, setOpen] = React.useState(false);
  const [seedOpen, setSeedOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [zords, setZords] = React.useState([]);
  const [zordId, setZordId] = React.useState(null);
  const [apiLock, setApiLock] = React.useState(false);
  // const [megazords, setMegazords] = React.useState([]);
  const api_functions = props.api_functions;
  const bitcloutData = props.bitcloutData;
  var USDbyBTCLT, createFeeBCLT, createFeeUSD;
  const user = props.user || {};
  const megazords = user.megazords || {};
  const megazordsOrdered = Object.keys(megazords).sort().reduce(
    (obj, key) => {
      obj[key] = megazords[key];
      return obj;
    }, {}
  );
  if (bitcloutData) {
    USDbyBTCLT = bitcloutData.exchangeRate.USDbyBTCLT;
    createFeeBCLT = bitcloutData.appState.CreateProfileFeeNanos / 1e9;
    createFeeUSD = (createFeeBCLT * USDbyBTCLT).toFixed(2);
  }

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleCreate = (zords) => {
    setOpen(false);
    setZords(zords);
    setSeedOpen(true);
  };

  const handleSeedClose = () => {
    setSeedOpen(false);
    setZords([]);
  }

  const handleConfirm = (megazordId) => {
    setSeedOpen(false);
    if (!megazordId) {
      var _zords = [...zords].map(it=>it.PublicKeyBase58Check)
      api_functions.createMegazord(_zords)
      .then(data =>  {}).catch(e => {})
    } else {
      api_functions.confirmMegazord(megazordId);
    }
  };

  const handleDetachMegazord = (e, megazordId) => {

  }
  const handleHideMegazord = (e, megazordId) => {
    e.preventDefault();
    if(apiLock) {return}
    setApiLock(true)
    api_functions.hideMegazord(megazordId).then(res=>{
      setApiLock(false)
    }).catch(e=> {setApiLock(false)})
  }

  const handleConfirmZord = (megazordId) => {
    setZordId(megazordId)
    setSeedOpen(true)
  }

  const createCopyPubKeyHandler = (pubKey) => {
    return (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(pubKey)
    }
  }

  return (
    <div>
      <CreateMegazord
        id="create-megazord"
        keepMounted
        open={open}
        user={user}
        api_functions={api_functions}
        onClose={handleClose}
        onCreate={handleCreate}
        value={value} />
      <SeedPhraseDialog
        id="seed-phrase-dialog"
        open={seedOpen}
        zordId={zordId}
        onClose={handleSeedClose}
        onConfirm={handleConfirm}
      />
      <Fab color="primary" aria-label="add" onClick={handleClickListItem}>
        <Icon>add</Icon>
      </Fab>
      <GridContainer>
        {Object.values(megazords).length ? (
          Object.values(megazordsOrdered).reverse().map(item => {
            return (
              <GridItem xs={12} sm={12} md={4} key={item.id}>
                <Card profile>
                  <CardHeader>
                    {item.color && (
                      <Tooltip
                        placement="top"
                        interactive
                        title={<span style={{fontSize:'12px'}}>{nameThisColor(item.color)[0].title + " Megazord"}</span>} >
                        <div className={classes.colorId} style={{
                          background:"linear-gradient(to bottom," +
                            `${adjust(item.color, 40)} 0%,${item.color} 50%,` +
                            `${adjust(item.color, -3)} 51%,${adjust(item.color, -20)} 100%)`
                        }}></div>
                      </Tooltip>
                    )}
                    <div className={classes.removeMegazord}>
                      <Tooltip title="Hide Megazord">

                         <IconButton aria-label="hide" className={classes.hideMegazord} onClick={
                           (e) => handleHideMegazord(e, item.id)
                           }>
                           <Icon>visibility_off</Icon>
                         </IconButton>
                      </Tooltip>
                    </div>
                    <CardAvatar profile>
                      <a href={item.link ? item.link : '#'} target='_blank'>
                        <img src={item.ProfilePic}
                            alt={item.name ? item.name : item.pub_key ? item.pub_key : ''}
                            style={{
                              objectFit: 'contain',
                              width: '100%',
                              height: '100%',
                            }} />
                      </a>
                    </CardAvatar>
                  </CardHeader>
                  <CardBody profile>
                    <h6 className={classes.cardCategory}>{
                      (item.status_id === 0 &&
                        <a target="_blank" href={item.link}>{item.Username}</a>)
                      ||(item.status_id === 1 &&
                        <span>{item.status_text}</span>)
                      ||(item.status_id === 2 &&
                        <div>
                          {item.status_text}
                          <Tooltip
                            style={{
                              marginLeft: '4px',
                              cursor: 'pointer',
                              verticalAlign: '-4px'}}
                            title={<div style={{
                              fontSize:'14px', padding:"4px", lineHeight:"14px"}}
                            dangerouslySetInnerHTML={{
                              __html: "Creating a profile currently costs " +
                              `${createFeeBCLT} BitClout ` +
                              `(≈ $${createFeeUSD} USD). ` +
                              "<br>Send this amount to current Megazord Public Key for activation." }}></div>}
                            placement="right"
                          >
                            <Icon className={classes.icon} fontSize="small">info</Icon>
                          </Tooltip>
                        </div>)
                      ||(item.status_id === 3 &&
                          <span>{item.status_text}</span>)
                      // item.status_text
                    }</h6>
                    <h4 className={classes.cardTitle}>
                      {item.PubKeyShort ? (
                        <div>
                          {item.PubKeyShort}
                          {/* BC1YLfqhoWhgfrcNnCGiNauSo6Hj1Q2PJRic39hj8H3rP9agDvBc5uu */}
                          <IconButton
                           tooltip="Copy to clipboard" style={{cursor: 'pointer'}}
                          size="sm" edge="end" onClick={createCopyPubKeyHandler(item.PublicKeyBase58Check)}>
                            <Icon fontSize="small">content_copy</Icon>
                          </IconButton>
                        </div>
                        ) : (<span>...</span>)
                      }
                    </h4>
                    <div style={{visibility: item.PubKeyShort ? 'visible' : 'hidden', minHeight: '75px'}}>
                      <div>Wallet Balance:</div>
                      {item.tasks.some(task => !!task.taskSessionRun) ? (
                          <CircularProgress style={{color: primaryColor[0], verticalAlign: 'middle'}} size={25}></CircularProgress>
                        ) : (
                          <div>
                            <MuiTypography style={{color: grayColor[2]}}>
                              $CLOUT {parseFloat((item.BalanceNanos / 1e9).toFixed(4)).toLocaleString()} ≈ ${(USDbyBTCLT ? item.BalanceNanos / 1e9 * USDbyBTCLT : 0).toFixed(2).toLocaleString()}
                            </MuiTypography>
                            <MuiTypography style={{color: grayColor[2]}}>
                              Coins
                              <Tooltip
                                id="tooltip-top"
                                interactive
                                title={getCoinsTable(item.UsersYouHODL)}
                                placement="bottom"
                              >
                                <Icon style={{verticalAlign: '-6px',cursor: 'pointer', margin:'0px 3px'}}>toll</Icon>
                              </Tooltip>
                            </MuiTypography>
                          </div>
                      )
                      }
                    </div>
                    <h5 className={classes.cardCategory}><b>Zords:</b></h5>
                    <GridContainer justify="center" style={{minHeight: '4rem', padding: '0.5rem 0 0 0'}}>
                      {item.zords.map(owner => {
                        return (
                          <GridItem xs={3} sm={3} key={owner.name} style={{display: 'flex', justifyContent: 'center'}}>
                            <Tooltip
                              id="tooltip-top"
                              title={'@'+owner.name + ': ' +  owner.status}
                              placement="top"
                            >
                              <a href={owner.link} target='_blank'>
                                <div style={{
                                margin: '0',
                                padding:'3px',
                                backgroundColor: owner.status == 'confirmed' ? successColor[0] : grayColor[0],
                                borderRadius: '100%',
                                width: '2rem',
                                height: '2rem',
                                }}>
                                  <img style={{
                                    width: '2rem',
                                    height: '2rem',
                                    borderRadius:'100%'
                                  }} src={owner.avatar} alt={owner.name + ' status: ' +  owner.status} />
                                </div>
                              </a>
                            </Tooltip>
                          </GridItem>
                        )
                      })}
                    </GridContainer>
                    {/* <p className={classes.description}>
                      Don{"'"}t be scared of the truth because we need to restart the
                      human foundation in truth And I love you like Kanye loves Kanye
                      I love Rick Owens’ bed design but the back is...
                    </p> */}
                    {(item.status_id !== 1 &&
                      <Button color="primary" href={"tasks_list/" + item.id} round>
                      <Icon>task</Icon>
                        Tasks
                        {(item.tasks.length !== 0) &&
                          <span className={classes.notifications}>{item.tasks.length}</span>
                        }
                      </Button>)
                    || ((item.status_id === 1) &&
                      (!item.canConfirm &&
                          <Button color="grey" round>
                            <Icon>pending</Icon>
                            Pending
                          </Button>)
                        || (item.canConfirm  &&
                          <Button color="success" round onClick={e => handleConfirmZord(item.id)}>
                            <Icon>pending</Icon>
                            Confirm
                          </Button>)
                      )
                    }
                  </CardBody>
                </Card>
              </GridItem>
            )
          })
        ) : (
          <GridItem xs={12} sm={12} md={4}>No Megazords account yet.</GridItem>
        )}
      </GridContainer>
    </div>
  );
}
