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
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
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
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
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
  hexToRgb
} from "assets/jss/material-dashboard-react.js";

import { bugs, website, server } from "variables/general.js";

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
    maxHeight: 435,
  },

}));

function CreateMegazord(props) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const [inputAccount, setInputAccount] = React.useState();
  const [userExist, setUserExist] = React.useState(true);
  const [accounts, setAccounts] = React.useState([{
    avatar: 'data:image/jpeg;base64,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',
    text: 'WhaleSharkdotPro'
  }]);
  const user = {
    avatar: 'data:image/jpeg;base64,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',
    text: 'transhumanist'
  }//props.user;
  const radioGroupRef = React.useRef(null);
  const classes = useMegazordStyles();
  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const inputOnChange = (event) => {
    const value = event.target.value

  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="dialog-title"
      classes={{
        paper: classes.paper,
      }}
      open={open}
      {...other}
    >
      <DialogTitle id="dialog-title">Create new Megazord</DialogTitle>
      <DialogContent dividers>
        <div className={classes.addOwnerWrapper}>
          <Input
            error={!userExist}
            success={userExist}
            onChange={inputOnChange}
            formControlProps={{
              className: classes.margin
            }}
            inputProps={{
              placeholder: "BitClout account",
              inputProps: {
                "aria-label": "BitClout account"
              }
            }}
          />
          {(userExist &&
            <Button edge="end" size='sm'  round aria-label="add" color="primary" >
              Add
            </Button>
          )}
        </div>
        <p className={classes.cardCategory}>Zords:</p>
        <List>
          <ListItem key={user.text} disabled>
            <ListItemAvatar>
              <Avatar style={{backgroundColor: '#fff'}}>
                <img style={{width: '2rem', height: '2rem', objectFit: 'contain'}} src={user.avatar}></img>
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{user.text}</ListItemText>
          </ListItem>
          {accounts.map(item => {
              return (
                <ListItem key={item.text}>
                  <ListItemAvatar>
                    <Avatar style={{backgroundColor: '#fff'}}>
                      <img style={{width: '2rem', height: '2rem', objectFit: 'contain'}} src={item.avatar}></img>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>{item.text}</ListItemText>
                  <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" style={{color:primaryColor[0]}} >
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
        <Button onClick={handleOk} color="secondary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateMegazord.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

export default function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('Dione');
  const user = props.user;
  debugger;
  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };
  const defaultAvatar = 'https://cdn.pixabay.com/photo/2019/09/26/19/08/hourglass-4506807__340.png'
  const megazords = [
    {
      name: 'BitcloutTechFund',
      id: makeid(10),
      pub_key: 'BC1YLj8LTffNBmCnrmGCgEG9y5upH14a9cnCrqw5ipC7sgEMi3TxgLa',
      avatar: 'https://capital.com/files/imgs/glossary/600xx/75-Investment%20fund.jpg',
      link: '',
      status_text: 'Active',
      status_id: 0,
      zords: [
        {
          avatar: 'data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAGQAZAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AOeooor9NO0KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoorqPBXhKTxNqG+YMmnQEec443n+4vv6+g+orKtWhRpupN2SBtJXZy/YHsenvRXul3D4d8VW174bgeIS2QAXy1A8k9inqAeD+VeLappl1o+pTWF4myaI4OOjDsw9jXLgsfHEtxceWS6Pt0ZMZ8xUooorvKCiiigAooooAKKKKACiiremabdavqMNjZR755TgegHcn0ApSkopyk9EBc8N+HrrxJqyWdvlIx8002MiNPX6+gr0Hxd4htfCOkR+HNCxHc7MM6nJhU9yf77f8A1/StIwp4K0OLR9Dtje6zcjICrks3Qyv6KO2fp61l6d4CstOWTWfF99HNIT5kiu+I9x5+Y9WPt0+tfN1cXTxFRVa3wL4Y9ZPvbt/Xcxck3d7Hmel6nc6RqUN/ZS7Z4WyOchh3B9Qa9V1iwsviN4Xi1PTgqajApCqTyG6tEx/UH6Huaetx4I8a7tNSNIJ0O2BhGIXPuh7j2P5ViwaRrfw51Y38Kvf6O/y3BiXkJ6svYj1HHbjNaV66rzUop060dk+q7fMbd32Z5y6PHI0cisjoSrKwwQR1BptenePvDUGqWK+KNF2yq8YecR8iRMcSD3Hf2+leY17GExUcTT546PquzNIy5lcKKKK6RhRRRQAUUUUAPhhluJ44II2klkYKiKMliegFe6eC/CcXhjTS821tQmUGeTso/uA+g/U/hXm/w41DS9O8SNJqTJGzxbIJpPuo2eee2Rxn/Gu38d6J4j1m33aVfLLYlQWs4/kZ/fdnDj24/Gvns2qzq1lhXLki92+plUd3yjfEPxE0rR5JotKjjvb5uHkX/Vgj+8w+9j0H5ivK9X1zUtduvtGo3LSsPup0RP8AdXoP51Tnt5rSdre4heGZOGjkUqw/A1HXp4PL6GGV4K77vcuMFHYOhBHBHIrufDXxKv8AS9ltqoe+tBwHJ/eoPqfvD68+9cNRW+Iw1LER5KquhuKe59EaBc6Ne2Uk+jSRtbyNueNOAjHrlf4Se479a8r8f+EDoN99vso/+JdcN90D/Uuf4foe35elYXhyHXZNTWTQEuPtK8F4uFA9GJ+XHsa9scO/hSZfFX2NQYiLgxE7MY9+/wBO/SvnZxllmJUoT5lLddf67Mx+CR8+UUfTOO2aK+pNwooooAKKKKACtzQfF2seHmC2lxvt88203zRn6d1/CsOioqUoVY8s1dA0nuet2/ifwp42gS01q2S1u+imU4wf9iQdPocfjWFr/wAL7+y3T6PJ9ut+vlNgSge3Zv0NcD1rotA8a6z4fKxwz+faj/l3nJZQP9k9V/Dj2rzHga2GfNg5afyvb5dv61I5WvhKWm+GtZ1a6a3tNPmLo22QyKUVD/tE9Pp1rvtP+HGkaNbfbvEuoRuq8mPf5cQ9ierfp9Kqal8WrmW2Cabpy28xHzSTPvC/QDGfx/KuC1HU77Vrk3GoXUtxL2Ltwv0HQfhRyY/E6Tfs4+Wr+/oHvS8j0bU/iZp+m2/2Hw1YRlE4WV02Rj3Cjk/jivPdV1vUtbn87UbyScg5VScKv0UcCqFFdeGwNDD6wWvd6sailsFFFFdZQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//Z',
          status: 'confirmed',
          name: 'bitclouthunt',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        {
          avatar: 'data:image/jpeg;base64,/9j/2wCEAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDIBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAGQAZAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APIaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKfDDJcTxQRLuklcIg9STgfqa6bxz4IufA+o2lpcXcd0LmHzVkjQqAQcMuD6cc+9AHLUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB1/wv0r+1/iLpERXMcEhuX47RjI/wDHttei/H21S40jRNSiKusdxLAXXn7wz/NDWP8ABGCOwj8R+JZx+6srXywT9C7foq/nUt1PJ4j/AGdWupTunsb0yOT1z5xz/wCOyUAePUVt+FfC2oeL9Z/szTjEsojaV3mJCIowMnAJ6kD8ay76zn07ULmxuk2XFvK0Ui+jKcGgCCiiigAooooAKKKKACiiigArQsNB1jVITNp+lXt3ErbS8EDOoPpkDrWfXWeHPiP4l8LaZ/Z2l3MC2u8yBJYA5BPXBoA7ia2n8H/s+TQXMMlvfatcFXjkUq672xgg8/6tP1qH4YD+1/hn4z0M8kRtKi+7RnH6xiuF8T+Otf8AF8NvDq9xE8UDF0SKIINxGMn14/nXX/Ae8WPxfqFjIfku7Inae5Rh/RjQBqfBdbXQvDOveLtQylupWEP3Crgtj6llH4Vm/FvwVqknjd9R0jS7q8t7+JZWa2hZwsg+U5I6Zwp/GtT4hWw8F/CPS/C6kCe8uWM20/eUMXb9SgrkbL4w+MbCygtIry1eOBFjUy2wZiAMDJzzx3oA6q1+AF1JpCy3OtpDqLJu8lYd0aH+6Wzk/UD868j1HT7nStSudPvI/LubaRopFznDA9j3FfQlr8c/DEmji4uku4r0J89osJbLeit93HuSK8D17V5df8QX+rTII3u5ml2A5Cg9BnvgACgDOooooAKKKKACiiigAooooAK674Yaiml/EfR5pHVI5JGgdmOBh1IGfxxXI0daAPSPjZra6p44WzhkV4dPt1i+VsjzG+Zvx+6PwrzeiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==',
          status: 'confirmed',
          name: 'bitclouthunt2',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        {
          avatar: 'data:image/jpeg;base64,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',
          status: 'confirmed',
          name: 'bitclouthunt3',
          link: 'https://bitclout.com/u/bitclouthunt'
        }]
    },
    {
      name: undefined,
      id: makeid(10),
      pub_key: 'BC1YLj8LTffNBmCnrmGCgEG9y5upH14a9cnCrqw5ipC7sgEMi3TxgLa',
      avatar: 'https://bitclout.com/img/logo-512.png',
      link: '',
      status_text: 'Active',
      status_id: 0,
      // zords: new Array(6).join(' ').split(' ').map((el, i) => { return {
      //     avatar: 'data:image/jpeg;base64,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',
      //     status: 'confirmed',
      //     name: 'bitclouthunt' + 10 + i,
      //     link: 'https://bitclout.com/u/bitclouthunt'
      //   }})
      zords: [
        {
          avatar: 'data:image/jpeg;base64,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',
          status: 'confirmed',
          name: 'bitclouthunt',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        {
          avatar: 'data:image/jpeg;base64,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',
          status: 'confirmed',
          name: 'bitclouthunt2',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        {
          avatar: 'data:image/jpeg;base64,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',
          status: 'confirmed',
          name: 'bitclouthunt3',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        {
          avatar: 'data:image/webp;base64,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',
          status: 'confirmed',
          name: 'bitclouthunt4',
          link: 'https://bitclout.com/u/bitclouthunt'
        }]
    },
    {
      name: undefined,
      pub_key: undefined,
      avatar: undefined,
      id: makeid(15),
      link: '',
      status_text: 'Pending zords confirmation',
      status_id: 1,
      zords: [
        {
          avatar: 'data:image/jpeg;base64,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',
          status: 'confirmed',
          name: 'bitclouthunt4',
          link: 'https://bitclout.com/u/bitclouthunt'
        },
        {
          avatar: 'data:image/jpeg;base64,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',
          status: 'pending',
          name: 'bitclouthunt5',
          link: 'https://bitclout.com/u/bitclouthunt'
        }]
    }
  ];
  return (
    <div>
      <CreateMegazord
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        value={value} />
      <Fab color="primary" aria-label="add" onClick={handleClickListItem}>
        <Icon>add</Icon>
      </Fab>
      <GridContainer>
        {megazords.map(item => {
          return (
            <GridItem xs={12} sm={12} md={4} key={item.id}>
              <Card profile>
                <CardHeader>
                  <CardAvatar profile>
                    <a href={item.link ? item.link : '#'} target='_blank'>
                      <img src={item.avatar ?  item.avatar : defaultAvatar}
                          alt={item.name ? item.name : item.pub_key ? item.pub_key : ''}
                          style={{
                            objectFit: 'contain',
                            width: '8rem',
                            height: '8rem',
                          }} />
                    </a>
                  </CardAvatar>
                </CardHeader>
                <CardBody profile>
                  <h6 className={classes.cardCategory}>{item.status_text}</h6>
                  <h4 className={classes.cardTitle}>
                    {item.name ? item.name : item.pub_key ? item.pub_key.slice(0, 12) + '...' : '...'}
                  </h4>
                  <h5 className={classes.cardCategory}><b>Zords:</b></h5>
                  <GridContainer justify="center" style={{minHeight: '6rem', padding: '0.5rem 0 0 0'}}>
                    {item.zords.map(owner => {
                      return (
                        <GridItem xs={3} sm={3} key={owner.name}>
                          <Tooltip
                            id="tooltip-top"
                            title={'Status: ' +  owner.status}
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
                  {(item.status_id === 0 &&
                    <Button color="primary" href={"tasks_list/" + item.id} round>
                    <Icon>task</Icon>
                      Tasks
                    </Button>)
                  || (item.status_id === 1 &&
                    <Button color="grey"  round>
                    <Icon>pending</Icon>
                      Status
                    </Button>)
                  }
                </CardBody>
              </Card>
            </GridItem>
          )
        })}
      </GridContainer>
      {/* <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Daily Sales</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                increase in today sales.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> updated 4 minutes ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={emailsSubscriptionChart.data}
                type="Bar"
                options={emailsSubscriptionChart.options}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Email Subscriptions</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card chart>
            <CardHeader color="danger">
              <ChartistGraph
                className="ct-chart"
                data={completedTasksChart.data}
                type="Line"
                options={completedTasksChart.options}
                listener={completedTasksChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Completed Tasks</h4>
              <p className={classes.cardCategory}>Last Campaign Performance</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> campaign sent 2 days ago
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Bugs",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                )
              },
              {
                tabName: "Website",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                )
              },
              {
                tabName: "Server",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                )
              }
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Employees Stats</h4>
              <p className={classes.cardCategoryWhite}>
                New employees on 15th September, 2016
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Name", "Salary", "Country"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands"],
                  ["4", "Philip Chaney", "$38,735", "Korea, South"]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer> */}

    </div>
  );
}

// <GridItem xs={12} sm={6} md={3}>
// <Card>
//   <CardHeader color="warning" stats icon>
//     <CardIcon color="warning">
//       <Icon>content_copy</Icon>
//     </CardIcon>
//     <p className={classes.cardCategory}>Used Space</p>
//     <h3 className={classes.cardTitle}>
//       49/50 <small>GB</small>
//     </h3>
//   </CardHeader>
//   <CardFooter stats>
//     <div className={classes.stats}>
//       <Danger>
//         <Warning />
//       </Danger>
//       <a href="#pablo" onClick={e => e.preventDefault()}>
//         Get more space
//       </a>
//     </div>
//   </CardFooter>
// </Card>
// </GridItem>
// <GridItem xs={12} sm={6} md={3}>
// <Card>
//   <CardHeader color="success" stats icon>
//     <CardIcon color="success">
//       <Store />
//     </CardIcon>
//     <p className={classes.cardCategory}>Revenue</p>
//     <h3 className={classes.cardTitle}>$34,245</h3>
//   </CardHeader>
//   <CardFooter stats>
//     <div className={classes.stats}>
//       <DateRange />
//       Last 24 Hours
//     </div>
//   </CardFooter>
// </Card>
// </GridItem>
// <GridItem xs={12} sm={6} md={3}>
// <Card>
//   <CardHeader color="danger" stats icon>
//     <CardIcon color="danger">
//       <Icon>info_outline</Icon>
//     </CardIcon>
//     <p className={classes.cardCategory}>Fixed Issues</p>
//     <h3 className={classes.cardTitle}>75</h3>
//   </CardHeader>
//   <CardFooter stats>
//     <div className={classes.stats}>
//       <LocalOffer />
//       Tracked from Github
//     </div>
//   </CardFooter>
// </Card>
// </GridItem>
// <GridItem xs={12} sm={6} md={3}>
// <Card>
//   <CardHeader color="info" stats icon>
//     <CardIcon color="info">
//       <Accessibility />
//     </CardIcon>
//     <p className={classes.cardCategory}>Followers</p>
//     <h3 className={classes.cardTitle}>+245</h3>
//   </CardHeader>
//   <CardFooter stats>
//     <div className={classes.stats}>
//       <Update />
//       Just Updated
//     </div>
//   </CardFooter>
// </Card>
// </GridItem>
