/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import logo from "assets/img/text-logo-1.svg";
// core components
// import styles from "assets/jss/material-dashboard-react/components/footerStyle.js";
import {
  defaultFont,
  container,
  primaryColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const useStyles = makeStyles({
  block: {
    color: "inherit",
    padding: "15px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block",
    ...defaultFont,
    fontWeight: "500",
    fontSize: "12px"
  },
  left: {
    // float: "left!important",
    display: "block"
  },
  right: {
    marginTop: "7px",
    padding: "15px 0",
    margin: "0",
    fontSize: "14px",
    color: '#fff',
    display: 'flex',
    alignItems: 'center'
    // float: "right!important"
  },
  footer: {
    // position: "fixed",
    bottom: "0",
    width: "100%",
    // height: "10vh",
    backgroundColor: '#222222',
    padding: "10px 24px",
    ...defaultFont
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  }
});

export default function Footer(props) {
  const classes = useStyles();
  const socailItems = [{
    name: 'CloutMegazord',
    img: 'https://bitclout.com/api/v0/get-single-profile-picture/BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE?fallback=https://bitclout.com/assets/img/default_profile_pic.png',
    link: 'https://bitclout.com/u/CloutMegazord'
  }]
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <img src={logo} alt={'Logo'} style={{filter: 'brightness(0) invert(1)'}}/>
        </div>
        <div className={classes.right}>
          <List className={classes.list}>
            {socailItems.map((item => {
              return (
                <ListItem key={item.name} className={classes.inlineBlock}>
                  <a href={item.link} target="_blank" rel="noopener" className={classes.block}>
                    <img src={item.img} alt={item.name} style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '100%'
                    }}/>
                  </a>
              </ListItem>
              )
            }))}
          </List>
          <span>
            {/* &copy; */}
            {1900 + new Date().getYear()}{" "}
            <span style={{textTransform: "uppercase"}}> in active development</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
