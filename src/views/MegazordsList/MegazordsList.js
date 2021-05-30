import React from "react";
import classNames from "classnames";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/Icon";
import DeleteIcon from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import Tooltip from "@material-ui/core/Tooltip";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import Info from "components/Typography/Info";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
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
import Table from "components/Table/Table.js";
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
  // const user = {
  //   avatar: 'data:image/jpeg;base64,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',
  //   text: 'transhumanist'
  // }//props.user;
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
  }
}));

export default function MegazordsList(props) {
  const classes = Object.assign(useStyles(), useStyles2());
  const [open, setOpen] = React.useState(false);
  const [seedOpen, setSeedOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [zords, setZords] = React.useState([]);
  const [zordId, setZordId] = React.useState(null);
  // const [megazords, setMegazords] = React.useState([]);
  const api_functions = props.api_functions;
  const bitcloutData = props.bitcloutData;
  if (bitcloutData) {
    var createFeeBCLT = bitcloutData.appState.CreateProfileFeeNanos / 1e9;
    var createFeeUSD = (createFeeBCLT * bitcloutData.exchangeRate.USDbyBTCLT).toFixed(2);
  }

  const user = props.user || {};
  const megazords = user.megazords || {};

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
          Object.values(megazords).map(item => {
            return (
              <GridItem xs={12} sm={12} md={4} key={item.id}>
                <Card profile>
                  <CardHeader>
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
                    <h5 className={classes.cardCategory}><b>Zords:</b></h5>
                    <GridContainer justify="center" style={{minHeight: '6rem', padding: '0.5rem 0 0 0'}}>
                      {item.zords.map(owner => {
                        return (
                          <GridItem xs={3} sm={3} key={owner.name}>
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
