import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';
import routes from "routes.js";

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
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    textTransform: 'uppercase'
  },
  contnet: {
    width: '70%'
  }
}));

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/landing") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/landing" to="/landing/home" />
  </Switch>
);


export default function Landing({ ...rest }) {
  const classes = useStyles();
  return (
    <div>{switchRoutes}</div>
    // <div className={classes.paper}>
    //   <div className={classes.contnet}>
    //     <Typography variant="h2" component="h2">
    //       CloutMegazord - First distributed account management tool for Bitclout
    //     </Typography>
    //     <Typography variant="h5" component="h5">
    //       Create a distributed account by splitting high entropy seed phrase between several owners without storing it on server.
    //     </Typography>
    //     <Typography variant="body1">
    //       For building <b>trustless</b> Bitclout based:
    //       <i>Foundations, Organizations, Startups, Groups, Incubators or whatever you want.</i>
    //     </Typography>

    //   <h1 class="under_construction-title"></h1>
    //   <h3></h3>
    //   <p class="under_construction-p under_construction-description">

    //         </p>
    //   </div>
    // </div>
    )
}