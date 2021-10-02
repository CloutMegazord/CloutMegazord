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

export default function TaskSessionRedirect(props) {
    const classes = useStyles();
    const api_functions, user = {...props}
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('tid');
    const zordPublicKeyBase58Check = urlParams.get('zid');
    var taskUser, setTaskUser = React.useState(null);
    api_functions.getBitcloutAcc(zordPublicKeyBase58Check)
    if (user) {
      if (user.id === zordPublicKeyBase58Check) {
        api_functions.getTaskSessionLink({taskId})
          .then((data) => {
            window.location.href = data.taskLink;
          });
      } else {
        api_functions.getBitcloutAcc(zordPublicKeyBase58Check).then((Profile) => {
          setTaskUser(Profile);
        })
      }
    }
    return (
      <div>
        {taskUser &&
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <MuiTypography style={{ color: warningColor[0] }}>
              You should Login as @{taskUser.Username} for performing this action.
            </MuiTypography>
            <SignIn api_functions={api_functions}></SignIn>
          </Box>
        }
      </div>
    )
}