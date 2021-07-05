import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Tasks from "components/Tasks/Tasks.js";
import TasksMap from "../../controlsmap";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import {
  grayColor,
  secondaryColor,
} from "assets/jss/material-dashboard-react.js";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
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
      lineHeight: "1",
    },
  },
};

function makeid(length) {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
}

const useStyles = makeStyles(styles);
const useCreateTaskStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  title: {
    textAlign: "center",
  },
  formControl: {
    minWidth: theme.spacing(15),
    margin: theme.spacing(1),
  },
  taskForm: {
    display: "flex",
    flexDirection: "column",
    minWidth: "30%",
  },
}));

function CreateTask(props) {
  const {
    onCreate,
    onClose,
    open,
    user,
    megazord,
    api_functions,
    exchangeRate,
    indexFunctons,
    ...other
  } = props;
  const classes = useCreateTaskStyles();
  const [bitcloutAccount, setBitcloutAccount] = React.useState(null);
  const [inputState, setInputState] = React.useState(0);
  const [accounts, setAccounts] = React.useState([]);

  const [taskType, setTaskType] = React.useState("");
  var tasksTypes = new Array(Object.keys(TasksMap).length);
  var tasksMap = {};
  for (let key in TasksMap) {
    tasksMap[key] = TasksMap[key]({
      user,
      megazord,
      api_functions,
      exchangeRate,
      indexFunctons,
    });
    tasksTypes[tasksMap[key].order] = { key, disabled: tasksMap[key].disabled };
  }
  if (taskType) {
    var taskForm = tasksMap[taskType];
  }

  const onFinish = () => {
    // setValue('');
    setTaskType("");
    // setAccounts([]);
  };

  const handleCancel = () => {
    onFinish();
    onClose();
  };

  const handleOk = () => {
    var taskResult = { type: taskType };
    for (let control of taskForm.controls) {
      for (let valueName in control.values) {
        taskResult[valueName] = document.getElementById(
          control.values[valueName].id
        ).value;
        if (control.values[valueName].type === "integer") {
          taskResult[valueName] = parseInt(taskResult[valueName]);
        }
        if (!taskResult[valueName] && control.values[valueName].required) {
          alert(`fill in ${control.name} field`);
          return;
        }
      }
    }
    onFinish();
    onCreate(taskResult);
  };

  const addToList = (e) => {
    e.preventDefault();
    setAccounts([...accounts, { ...bitcloutAccount }]);
    // setValue('');
    // setInputState(0);
  };

  const removeFromList = (e, id) => {
    e.preventDefault();
    var _accounts = [...accounts].filter((it) => it.id !== id);
    setAccounts(_accounts);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setTaskType(event.target.value);
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
      <DialogTitle id="dialog-title" className={classes.title}>
        Create new Task
      </DialogTitle>
      <DialogContent dividers className={classes.paper}>
        {/*  className={classes.addOwnerWrapper} */}
        <form className={classes.taskForm}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Task Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={taskType}
              onChange={handleChange}
            >
              {tasksTypes.map((item) => {
                return (
                  <MenuItem
                    key={item.key}
                    id={item.key}
                    value={item.disabled ? "" : item.key}
                  >
                    {item.key + (item.disabled ? " (soon)" : "")}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {taskType &&
            taskForm.controls.map((item) => {
              return (
                <div className={classes.formControl} key={item.name}>
                  {/* <InputLabel id={item}>{item.name}</InputLabel> */}
                  {item.component}
                </div>
              );
            })}
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="secondary" disabled={!taskType}>
          Create
        </Button>
      </DialogActions>
      {/* <img style={{width: '2rem', height: '2rem', objectFit: 'contain'}} src={item.avatar}></img> */}
    </Dialog>
  );
}

export default function TableList(props) {
  const classes = useStyles();
  const user = props.user || {};
  const api_functions = props.api_functions;
  const indexFunctons = props.indexFunctons;

  if (props.bitcloutData) {
    var exchangeRate = props.bitcloutData.exchangeRate;
  }
  const megazordId = window.location.pathname.split("/").pop();
  var megazord = user.megazords ? user.megazords[megazordId] : {};
  megazord = megazord || {};
  const tasks = megazord.tasks || [];
  const [openCT, setOpenCT] = React.useState(false);

  const powerOnHandler = (e, taskId) => {
    e.preventDefault();
    props.setOpenBackdrop(true);
    api_functions
      .task({
        action: "powerOn",
        task: { id: taskId },
        megazordId: megazordId,
      })
      .then((data) => {
        props.setOpenBackdrop(false);
        window.location.href = data.taskLink;
      })
      .catch((e) => {
        props.setOpenBackdrop(false);
      });
  };

  const createHandler = (taskResult) => {
    api_functions.task({
      action: "create",
      task: taskResult,
      megazordId: megazordId,
    });
    setOpenCT(false);
  };

  const addNewTaskbtnHandler = (e) => {
    e.preventDefault();
    if (megazord.PublicKeyBase58Check) {
      setOpenCT(true);
    } else {
      indexFunctons.notifSnak(
        "open",
        "info",
        "Waiting for Megazord Public Key",
        3000
      );
    }
  };
  const deleteHandler = (e, taskId) => {
    e.preventDefault();
    api_functions.task({
      action: "delete",
      task: { id: taskId },
      megazordId: megazordId,
    });
  };

  const closeHandler = () => {
    setOpenCT(false);
  };
  return (
    <div>
      {user.id && megazord.id && (
        <CreateTask
          open={openCT}
          user={user}
          megazord={megazord}
          api_functions={api_functions}
          exchangeRate={exchangeRate}
          onCreate={createHandler}
          onClose={closeHandler}
          indexFunctons={indexFunctons}
        />
      )}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>
                {megazord.name || megazord.status}
              </h4>
              <Button
                style={{
                  backgroundColor: megazord.PublicKeyBase58Check
                    ? secondaryColor[0]
                    : grayColor[9],
                }}
                color="secondary"
                edge="end"
                onClick={addNewTaskbtnHandler}
              >
                Add new Task
              </Button>
            </CardHeader>
            <CardBody>
              <Tasks
                tableHeaderColor="primary"
                user={user}
                tasks={tasks}
                powerOnHandler={powerOnHandler}
                deleteHandler={deleteHandler}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
