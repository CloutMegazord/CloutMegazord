import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import SignIn from 'components/SignIn/SignIn';
import MuiTypography from "@material-ui/core/Typography";
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
    defaultFont,
  } from "assets/jss/material-dashboard-react.js";

import { bugs, website, server } from "variables/general.js";
import CryptoLib from "../../crypto";

import {
dailySalesChart,
emailsSubscriptionChart,
completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import avatar from "assets/img/faces/marc.jpg";
import Box from "@material-ui/core/Box";
import logo from "assets/img/logo_small.png";

const useStyles = makeStyles((theme) => ({
  message: {
    textAlign: 'center',
    fontSize:'1.5vw',
    margin:'1vw',
    [theme.breakpoints.down("sm")]: {
      fontSize:'24px',
      margin:'24px'
    },
  },
  logo: {
    position: 'absolute',
    left: 'calc(100% / 2 - 75px)',
    top: 'calc(50% / 2 - 75px)'
  }
}));

export default function TaskSessionRedirect(props) {
    const classes = useStyles();
    const {api_functions, user} = props
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('tid');
    const zordPublicKeyBase58Check = urlParams.get('zid');
    var [taskUser, setTaskUser] = React.useState(null);
    if (user && taskId && zordPublicKeyBase58Check) {
      if (user.id === zordPublicKeyBase58Check) {
        api_functions.getTaskSessionLink({taskId})
          .then((data) => {
            window.location.href = data.taskLink;
          });
      } else if (!taskUser) {
        setTaskUser({});
        api_functions.getBitcloutAcc(zordPublicKeyBase58Check).then((Profile) => {
          setTaskUser(Profile);
        })
      }
    }
    return (
      <div>
        <div>
          <img src={logo} className={classes.logo} alt="increase priority" />
        </div>
        {taskUser &&
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            minHeight="100vh"
          >
            <MuiTypography className={classes.message}>
              You should be logined as <a target="_blank" href={"https://bitclout.com/u/" + taskUser.Username}>@{taskUser.Username}</a> for performing this action.
            </MuiTypography>
            <SignIn api_functions={api_functions} autoComplete={false}></SignIn>
          </Box>
        }
      </div>
    )
}