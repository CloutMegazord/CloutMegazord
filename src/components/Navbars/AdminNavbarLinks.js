import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Link from "@material-ui/core/Link";

import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import { SvgIcon } from "@material-ui/core";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const NOTIFICATION_STATUSES = {
  UNREAD: 0,
  READ: 1,
};

const useStyles = makeStyles(styles);
const useStyles2 = makeStyles((theme) => ({
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  notificationItemDisabled: {
    backgroundColor: theme.palette.grey[300],
    pointerEvents: "none",
  },
}));

const getDateStringServ = (timestamp) => {
  const plus0 = (num) => `0${num.toString()}`.slice(-2);

  const d = new Date(timestamp);

  const year = d.getFullYear();
  const monthTmp = d.getMonth() + 1;
  const month = plus0(monthTmp);
  const date = plus0(d.getDate());
  const hour = plus0(d.getHours());
  const minute = plus0(d.getMinutes());
  const second = plus0(d.getSeconds());
  const rest = timestamp.toString().slice(-5);

  return `(${hour}:${minute}:${second} ${month}/${date}/${year
    .toString()
    .slice(2)})`;
};

export default function AdminNavbarLinks(props) {
  const { notifications, Username, ProfilePic } = props.user || {};
  const api_functions = props.api_functions;
  const notifications_count = Object.values(notifications || {})?.filter(
    (notification) => notification.status !== NOTIFICATION_STATUSES.READ
  ).length;
  const classes = Object.assign(useStyles(), useStyles2());
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };

  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(null);
  };

  const handleClickNotificationItem = (notificationKey) => {
    if (api_functions) {
      api_functions.changeNotificationStatus({
        notificationId: notificationKey,
        notificationStatus: NOTIFICATION_STATUSES.READ,
      });
    }
  };

  return (
    <div>
      {/* <div className={classes.searchWrapper}>
        <CustomInput
          formControlProps={{
            className: classes.margin + " " + classes.search
          }}
          inputProps={{
            placeholder: "Search",
            inputProps: {
              "aria-label": "Search"
            }
          }}
        />
        <Button color="white" aria-label="edit" justIcon round>
          <Search />
        </Button>
      </div> */}
      {/* <Button
        color={window.innerWidth > 959 ? "transparent" : "white"}
        justIcon={window.innerWidth > 959}
        simple={!(window.innerWidth > 959)}
        aria-label="Dashboard"
        className={classes.buttonLink}
      >
        <Dashboard className={classes.icons} />
        <Hidden mdUp implementation="css">
          <p className={classes.linkText}>Dashboard</p>
        </Hidden>
      </Button> */}
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openNotification ? "notification-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} />
          {Boolean(notifications_count) && (
            <span className={classes.notifications}>
              {notifications_count <= 10 ? notifications_count : 10}
            </span>
          )}
          <Hidden mdUp implementation="css">
            <p onClick={handleCloseNotification} className={classes.linkText}>
              Notification
            </p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">
                    {Object.keys(notifications)
                      ?.slice(-10)
                      ?.reverse()
                      ?.map((key) => {
                        return (
                          <MenuItem
                            key={key}
                            onClick={() => handleClickNotificationItem(key)}
                            className={classNames(classes.dropdownItem, {
                              [classes.notificationItemDisabled]:
                                notifications[key].status ===
                                NOTIFICATION_STATUSES.READ,
                            })}
                          >
                            {notifications[key].message.replace(
                              "%username%",
                              Username
                            ) +
                              " " +
                              getDateStringServ(notifications[key].ts)}
                          </MenuItem>
                        );
                      })}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          {ProfilePic ? (
            <Avatar alt={Username} src={ProfilePic} />
          ) : (
            <Person className={classes.icons} />
          )}
          {/* <SvgIcon /> */}
          {/* <Person className={classes.icons} /> */}
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <Link
                      target="_blank"
                      href={"https://bitclout.com/u/" + Username}
                    >
                      <MenuItem
                        // onClick={handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Profile
                      </MenuItem>
                    </Link>
                    {/* <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Settings
                    </MenuItem> */}
                    <Divider light />
                    <MenuItem
                      onClick={(e) => api_functions.logout()}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
      </div>
    </div>
  );
}
