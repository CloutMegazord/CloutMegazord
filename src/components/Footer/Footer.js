/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
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
    // float: "right!important"
  },
  footer: {
    // position: "fixed",
    bottom: "0",
    width: "100%",
    // height: "10vh",
    backgroundColor: '#222222',
    padding: "5px 0",
    ...defaultFont
  },
  container: {
    display: 'flex',
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
    img: '/assets/img/avatars/CloutMegazord.jpeg',
    link: 'https://bitclout.com/u/CloutMegazord'
  },{
    name: 'transhumanist',
    img: '/assets/img/avatars/transhumanist.jpeg',
    link: 'https://bitclout.com/u/transhumanist'
  },{
    name: 'bithunt',
    img: '/assets/img/avatars/bithunt.jpeg',
    link: 'https://www.bitclouthunt.com/p/120'
  }]
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            {socailItems.map((item => {
              return (
                <ListItem key={item.name} className={classes.inlineBlock}>
                  <a href={item.link} target="_blank" rel="noopener" className={classes.block}>
                    <img src={item.img} alt={item.name} style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '100%'
                    }}/>
                  </a>
              </ListItem>
              )
            }))}

            {/* <ListItem className={classes.inlineBlock}>
              <a href="#company" className={classes.block}>
                Company
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#portfolio" className={classes.block}>
                Portfolio
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a href="#blog" className={classes.block}>
                Blog
              </a>
            </ListItem> */}
          </List>
        </div>
        <p className={classes.right}>
          <span>
            &copy; {1900 + new Date().getYear()}{" "}
            <a
              href="https://bitclout.com/u/transhumanist"
              target="_blank"
              className={classes.a}
            >
              @transhumanist
            </a>
            <span style={{textTransform: "uppercase"}}> in active development</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
