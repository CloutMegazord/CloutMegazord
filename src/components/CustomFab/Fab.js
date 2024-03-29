import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";

// material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Fab from '@material-ui/core/Fab';

import styles from "assets/jss/material-dashboard-react/components/buttonStyle.js";

const useStyles = makeStyles(Object.assign(styles, {
  fab: {
    bottom: 20,
    right: 20,
    zIndex: 999,
    position: 'fixed',
  }
}));

export default function CustomFab(props) {
  const classes = useStyles();
  const {
    color,
    circle,
    fab,
    children,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    ...rest
  } = props;
  const fabClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.circle]: true,
    [classes.fab]: true,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className
  });
  return (
    <Fab {...rest} classes={muiClasses} className={fabClasses}>
      {children}
    </Fab>
  );
}

CustomFab.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "rose",
    "white",
    "transparent"
  ]),
  size: PropTypes.oneOf(["sm", "lg"]),
  simple: PropTypes.bool,
  fab: PropTypes.bool,
  circle: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
  className: PropTypes.string,
  // use this to pass the classes props from Material-UI
  muiClasses: PropTypes.object,
  children: PropTypes.node
};
