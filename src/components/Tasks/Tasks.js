import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import MuiTypography from '@material-ui/core/Typography';
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import CircularProgress from '@material-ui/core/CircularProgress'
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
// @material-ui/icons
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
// core components
import styles from "assets/jss/material-dashboard-react/components/tasksStyle.js";
import {
  defaultFont,
  primaryColor,
  secondaryColor,
  dangerColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const useStyles = makeStyles(styles);

export default function Tasks(props) {
  const classes = useStyles();
  const { tasks, user, rtlActive, tableHeaderColor, powerOnHandler, deleteHandler} = props;
  const tableHead=["Task type", "Added by", "Date", "Desctiption", "Actions"]
  const tableCellClasses = classnames(classes.tableCell, {
    [classes.tableCellRTL]: rtlActive
  });

  return (
    <Table className={classes.table}>
       {tableHead !== undefined ? (
          <TableHead className={classes[tableHeaderColor + "TableHeader"]}>
            <TableRow className={classes.tableHeadRow}>
              {tableHead.map((prop, key) => {
                return (
                  <TableCell
                    className={classes.tableCell + " " + classes.tableHeadCell}
                    key={key}
                  >
                    {prop}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
        ) : null}
      <TableBody>
        {tasks.map(value => (
          <TableRow key={value.id} className={classes.tableRow}>
            {/* <TableCell className={tableCellClasses}>
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                onClick={() => handleToggle(value)}
                checkedIcon={<Check className={classes.checkedIcon} />}
                icon={<Check className={classes.uncheckedIcon} />}
                classes={{
                  checked: classes.checked,
                  root: classes.root
                }}
              />
            </TableCell> */}
            <TableCell className={tableCellClasses}>
              <span style={{fontWeight: 'bold'}}>{value.type}</span>
            </TableCell>
            <TableCell className={tableCellClasses}>
              <Tooltip
                  id="tooltip-top"
                  title={value.addedBy.Username || value.addedBy.id}
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                <img
                  src={value.addedBy.ProfilePic}
                  alt={value.addedBy.Username || value.addedBy.id}
                  style={{
                    objectFit: 'contain',
                    borderRadius: '100%',
                    width: '2rem',
                    height: '2rem',
                  }}/>
              </Tooltip>
            </TableCell>
            <TableCell className={tableCellClasses}>{new Date(value.date).toLocaleDateString("en-US")}</TableCell>
            <TableCell style={{maxWidth: '6rem',  textAlign: 'center'}}>
              <MuiTypography
                variant="caption"
                style={{
                  color:grayColor[2],
                  fontSize: '14px'
                }}>{value.description}</MuiTypography>
            </TableCell>
            <TableCell className={tableCellClasses}>
            {!!value.taskSessionRun ? (
                <Tooltip
                  id="tooltip-top"
                  title='Task Session already running. Ask task initiator for personal link.'
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <CircularProgress style={{color: primaryColor[0], verticalAlign: 'middle'}} size={25}></CircularProgress>
                </Tooltip>
              ):(
                <div>
                {value.addedBy.id === user.id &&
                    <Tooltip
                    id="tooltip-top"
                    title="Delete Task"
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                    >
                      <IconButton
                        color="primary"
                        href={"task/" + value.id}
                        aria-label={tableHead[3]}
                        onClick={(e) => {deleteHandler(e, value.id)}}
                        className={classes.tableActionButton}
                        >
                          <Icon style={{'color': dangerColor[0]}}>delete</Icon>
                      </IconButton>
                    </Tooltip>
                  }
                <Tooltip
                    id="tooltip-top"
                    title='Power On'
                    placement="top"
                    classes={{ tooltip: classes.tooltip }}
                  >
                  <IconButton
                    href={"task/" + value.id}
                    aria-label={tableHead[4]}
                    style={{color:'#fff'}}
                    onClick={(e) => {powerOnHandler(e, value.id)}}
                    className={classes.tableActionButton}
                    >
                      <Icon style={{'color': primaryColor[0]}}>play_circle</Icon>)
                  </IconButton>
                </Tooltip>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

Tasks.propTypes = {
  tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  tasks: PropTypes.array,
  rtlActive: PropTypes.bool
};


              // {/* {value.addedBy.id === user.id ? (
              //     <Tooltip
              //       id="tooltip-top"
              //       title="Edit Task"
              //       placement="top"
              //       classes={{ tooltip: classes.tooltip }}
              //     >
              //       <IconButton
              //         color="primary"
              //         href={"task/" + value.id}
              //         aria-label={tableHead[3]}
              //         className={classes.tableActionButton}
              //         >
              //           <Icon style={{'color': secondaryColor[0]}}>edit</Icon>
              //         </IconButton>
              //     </Tooltip>
              // ) : (
              //   <Tooltip
              //     id="tooltip-top"
              //     title="Task Info"
              //     placement="top"
              //     classes={{ tooltip: classes.tooltip }}
              //   >
              //     <IconButton
              //       color="primary"
              //       href={"task/" + value.id}
              //       aria-label={tableHead[3]}
              //       className={classes.tableActionButton}
              //     >
              //       <Icon style={{'color': grayColor[0]}}>info</Icon>
              //     </IconButton>
              //   </Tooltip>
              // )} */}