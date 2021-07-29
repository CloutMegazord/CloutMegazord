import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import AppBar from '../components/AppBar';
import SignIn from '../../../../components/SignIn/SignIn';
import Button from '../../../../components/CustomButtons/Button';
import Typography from '../components/Typography';
import Toolbar, { styles as toolbarStyles } from '../components/Toolbar';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Box from '@material-ui/core/Box';
import logo from "assets/img/text-logo-2.svg";
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {
  primaryColor,
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
  logoLink: {
    height: '100%',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  placeholder: toolbarStyles(theme).root,
  toolbar: {
    justifyContent: 'space-between',
    position: 'relative',
    height: '7vh'
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
  menu: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    color: '#000',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    '& a': {
      color: '#000'
    }
  },
  buttonWrapper: {
    position: 'absolute',
    left: '50%',
    padding: '0',
    transform: 'translate(-50%, 0)'
  }
});

function AppAppBar(props) {
  const { classes, api_functions } = props;
  return (
    <div style={{height: '7vh'}}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Link
            className={classes.logoLink}
            href="https://bitclout.com/u/CloutMegazord"
          >
             {/* <img src={logo} style={{
              //  filter: 'brightness(0) invert(1)'
              }}alt="logo" className={classes.img} /> */}
          </Link>
          {/* <div className={classes.left} /> */}
          <Box className={classes.buttonWrapper}>
            <SignIn api_functions={api_functions}
              component={(props) => (
                <Button color='primary' style={{padding: "12px 30px"}} startIcon={<PowerSettingsNewIcon/>} onClick={props.onClick}>
                  <Typography variant="body1">Power On</Typography>
                </Button>
              )}
            />
            {/* <Button size='lg' color='primary' endIcon={<PowerSettingsNewIcon/>}>
              Power On
            </Button> */}
          </Box>
          {/* className={classes.right} */}
          <div>
          <MenuList className={classes.menu}>
            <MenuItem>
              <Link href="#product">Features</Link>
            </MenuItem>
            <MenuItem><a target="_blank" href="https://cloutmegazord.medium.com/cloutmegazord-mvp-functionality-overview-4353b3c715c5">Guid</a></MenuItem>
            <MenuItem><a target="_blank" href="https://bitclout.com/u/CloutMegazord">Invest</a></MenuItem>
          </MenuList>

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
