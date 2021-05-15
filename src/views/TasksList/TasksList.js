import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Input from "components/CustomInput/CustomInput.js"
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from "components/CustomButtons/Button.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Icon from "@material-ui/core/Icon";
import Avatar from '@material-ui/core/Avatar';
import InputLabel from '@material-ui/core/InputLabel';
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

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

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


class TasksProvider{
  constructor(api, user) {
    this.api = api;
    this.user = user
  }

  getTasks() {
    var tasks = [
      {
        id: makeid(10),
        creator: {
          avatar: 'data:image/jpeg;base64,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',
          pub_key: makeid(10),
          status: 'confirmed',
          name: 'cloutmegazord',
          link: 'https://bitclout.com/u/cloutmegazord'
        },
        type: 'Activate',//'sell', 'Update profile'
        date: Date.now()
      }
      // {
      //   id: makeid(10),
      //   creator: {
      //     avatar: 'data:image/jpeg;base64,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',
      //     pub_key: makeid(10),
      //     status: 'confirmed',
      //     name: 'bitclouthunt',
      //     link: 'https://bitclout.com/u/bitclouthunt'
      //   },
      //   type: 'sell',//'sell', 'Update profile'
      //   date: Date.now()
      // }
    ];
    return tasks
  }
}

const useStyles = makeStyles(styles);
const useCreateTaskStyles = makeStyles((theme) => ({
  paper: {
   display: 'flex',
   justifyContent: 'space-evenly'
  },
  title: {
    textAlign: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  }
}));

function CreateTask(props) {
  const { onCreate, onClose, value: valueProp, open, user, api_functions, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const classes = useCreateTaskStyles();
  const [inputAccount, setInputAccount] = React.useState('');
  const [bitcloutAccount, setBitcloutAccount] = React.useState(null);
  const [inputState, setInputState] = React.useState(0);
  const [sleepVar, setSleepVar] = React.useState(-1);
  const [accounts, setAccounts] = React.useState([]);
  const [age, setAge] = React.useState('');
  // const user = {
  //   avatar: 'data:image/jpeg;base64,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',
  //   text: 'transhumanist'
  // }//props.user;
  const radioGroupRef = React.useRef(null);
  // const classes = useMegazordStyles();
  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const onFinish = () => {
    setValue('');
    setInputState(0);
    setAccounts([]);
  }

  const handleCancel = () => {
    onFinish();
    onClose();
  };

  const handleOk = () => {
    onCreate([...accounts]);
    onFinish();
  };

  const addToList = (e) => {
    e.preventDefault();
    setAccounts([...accounts, {...bitcloutAccount}]);
    setValue('');
    setInputState(0);
  }

  const removeFromList = (e, id) => {
    e.preventDefault();
    var _accounts = [...accounts].filter(it => it.id !== id);
    setAccounts(_accounts);
  }

  const inputOnChange = (event) => {
    setInputState(1);
    var inputAccount = event.target.value;
    setValue(inputAccount);
    clearTimeout(sleepVar);
    let _sleepVar = setTimeout(() => {
      api_functions.getBitcloutAcc('', inputAccount).then(data => {
        data.id = data.PublicKeyBase58Check;
        if ([...accounts, user].some(it => it.id === data.id)) {
          throw Error('Account alredy exists.');
        }
        setBitcloutAccount(data);
        setInputState(2);
      }).catch(err => {
        setInputState(3);
      })
    }, 1000);
    setSleepVar(_sleepVar);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      fullScreen
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="dialog-title"

      open={open}
      {...other}
    >
      <DialogTitle id="dialog-title" className={classes.title}>Create new Task</DialogTitle>
      <DialogContent dividers className={classes.paper}>

        {/*  className={classes.addOwnerWrapper} */}

        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Task Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>Send Bitclouts</MenuItem>
            <MenuItem value={20}>Buy</MenuItem>
            <MenuItem value="">Sell</MenuItem>
            <MenuItem value=""></MenuItem>
          </Select>
        </FormControl>
          {/* <Input
            error={inputState===3}
            success={inputState===2}
            onChange={inputOnChange}
            formControlProps={{
              className: classes.margin
            }}
            disabled={accounts.length > 2}
            value={value}
            inputProps={{
              placeholder: (accounts.length > 2) ? "Limit reached" : "Add BitClout account",
              inputProps: {
                "aria-label": "BitClout account"
              }
            }}
          /> */}
          {/* {(inputState == 1  &&
            <CircularProgress size="1rem" style={{color: primaryColor[0]}}></CircularProgress>
          )}
          {(inputState == 2  &&
            <Button edge="end" size='sm' onClick={addToList} round aria-label="add" color="primary" >
              Add
            </Button>
          )} */}
        {/* className={classes.cardCategory} */}
        {/* <p>Zords (Max 4):</p> */}
        {/* <List> */}
          {/* <ListItem key={user.id} disabled>
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
        </List>*/}
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
    {/* <img style={{width: '2rem', height: '2rem', objectFit: 'contain'}} src={item.avatar}></img> */}
    </Dialog>

  );
}

export default function TableList(props) {
  const classes = useStyles();
  const user = props.user || {};

  const megazordId = window.location.pathname.split('/').pop();
  var megazord = user.megazords ? user.megazords[megazordId] : {};
  megazord = megazord || {};
  const tasks = megazord.tasks || [];
  const [openCT, setOpenCT] = React.useState(false);
  // setTimeout(() => {
  //   setTasks(arr => taskProvider.getTasks(), 1000)
  // })
  return (
    <div>
      <CreateTask
        open={openCT}
      />
      <GridContainer>
        {/* <GridItem xs={12} sm={12} md={6}>
          <Tasks
            checkedIndexes={[0, 3]}
            tasksIndexes={[0, 1, 2, 3]}
            tasks={tasks}
          />
        </GridItem> */}
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{megazord.name || megazord.status}</h4>
              <p className={classes.cardCategoryWhite}>
                Here is a subtitle for this table
              </p>
              <Button
                color="secondary"
                edge="end"
                onClick={() => setOpenCT(true)}>
                  Add new Task</Button>
            </CardHeader>
            <CardBody>
              <Tasks
                tableHeaderColor="primary"
                user={user}
                tasks={tasks}
              />
              {/* <Table
                tableHeaderColor="primary"
                tableHead={["Type", "Creator", "Date", "Info", "Run"]}
                tableData={[[1,2,3,4,5]]}
              /> */}
            </CardBody>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>
                Table on Plain Background
              </h4>
              <p className={classes.cardCategoryWhite}>
                Here is a subtitle for this table
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["ID", "Name", "Country", "City", "Salary"]}
                tableData={[
                  ["1", "Dakota Rice", "$36,738", "Niger", "Oud-Turnhout"],
                  ["2", "Minerva Hooper", "$23,789", "Curaçao", "Sinaai-Waas"],
                  ["3", "Sage Rodriguez", "$56,142", "Netherlands", "Baileux"],
                  [
                    "4",
                    "Philip Chaney",
                    "$38,735",
                    "Korea, South",
                    "Overland Park"
                  ],
                  [
                    "5",
                    "Doris Greene",
                    "$63,542",
                    "Malawi",
                    "Feldkirchen in Kärnten"
                  ],
                  ["6", "Mason Porter", "$78,615", "Chile", "Gloucester"]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>

  </div>
  );
}
