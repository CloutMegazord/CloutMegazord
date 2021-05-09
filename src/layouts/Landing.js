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

const getRoutes = (api_functions) => {
  return (
    <Switch>
      {routes.map((prop, key) => {
        if (prop.layout === "/landing") {
          return (
            <Route
              path={prop.layout + prop.path}
              key={key}
            >
              <prop.component api_functions={api_functions} />
            </Route>
          );
        }
        return null;
      })}
      <Redirect from="/landing" to="/landing/home" />
    </Switch>
  );
}


export default function Landing({ api_functions, ...rest }) {
  const classes = useStyles();
  return (
    <div>{getRoutes(api_functions)}</div>
    )
}