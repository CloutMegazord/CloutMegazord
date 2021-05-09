import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '../components/AppBar';
import SignIn from '../../../../components/SignIn/SignIn';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import {
  secondaryColor,
} from "../../../../assets/jss/material-dashboard-react.js";

const styles = (theme) => ({
  title: {
    fontSize: 24,
    textTransform: "none",
    '&:visited': {
      color: "#fff"
    },
    '&:hover': {
      color: secondaryColor[0]
    }
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  leftLinkActive: {
    color: theme.palette.common.white,
  },
  right: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  rightLink: {
    fontSize: 16,
    color: theme.palette.common.white,
    marginLeft: theme.spacing(3),
  },
  linkSecondary: {
    color: theme.palette.secondary.main,
  },
});

function AppAppBar(props) {
  const { classes, api_functions } = props;
  return (
    <div>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div className={classes.left} />
          <Link
            variant="h6"
            underline="none"
            color="inherit"
            target="_blank"
            rel="noopener"
            className={classes.title}
            href="https://bitclout.com/u/CloutMegazord"
          >
            {'CloutMegazord'}
          </Link>
          <div className={classes.right}>
          <SignIn api_functions={api_functions}/>
            {/* <Link
              color="inherit"
              variant="h6"
              underline="none"
              className={classes.rightLink}
              href="/premium-themes/onepirate/sign-in/"
            >
              {'Sign In'}
            </Link>
            <Link
              variant="h6"
              underline="none"
              className={clsx(classes.rightLink, classes.linkSecondary)}
              href="/premium-themes/onepirate/sign-up/"
            >
              {'Sign Up'}
            </Link> */}
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}

AppAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  api_functions: PropTypes.object,
};

export default withStyles(styles)(AppAppBar);
