import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
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
  dangerColor,
  grayColor
} from "assets/jss/material-dashboard-react.js";

const useStyles = makeStyles(styles);

// tasks = tasks.map(item => {
//   return [
//     item.type,
//     <img
//       src={item.creator.avatar}>
//       alt={item.creator.name ? item.creator.name : item.creator.pub_key}
//       style={{
//         objectFit: 'contain',
//         width: '8rem',
//         height: '8rem',
//       }}
//     </img>,
//     new Date(item.date).toLocaleDateString("en-US"),
//     <Button color="primary" href={"task/" + item.id} link round>
//       (this.user.pub_key === item.creator.pub_key &&
//         <Icon>info</Icon>
//       || (
//         <Icon>settings</Icon>
//       )
//     </Button>,
//     <Button color="primary" href={"megazord_action/" + item.id} link round>
//       <Icon>info</Icon>
//     </Button>
//    ]
// });

export default function Tasks(props) {
  const classes = useStyles();
  // const handleToggle = value => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];
  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }
  //   setChecked(newChecked);
  // };
  const { tasks, user, rtlActive, tableHead, tableHeaderColor } = props;
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
              <span style={{fontWeight: 'bold', textTransform: 'uppercase'}}>{value.type}</span>
            </TableCell>
            <TableCell className={tableCellClasses}>
              <Tooltip
                  id="tooltip-top"
                  title={value.creator.name}
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                <img
                  src={value.creator.avatar}
                  alt={value.creator.name ? value.creator.name : value.creator.pub_key}
                  style={{
                    objectFit: 'contain',
                    borderRadius: '100%',
                    width: '2rem',
                    height: '2rem',
                  }}/>
              </Tooltip>
            </TableCell>
            <TableCell className={tableCellClasses}>{new Date(value.date).toLocaleDateString("en-US")}</TableCell>
            <TableCell className={classes.tableActions}>
              <Tooltip
                id="tooltip-top"
                title={user.pub_key === value.creator.pub_key ? "Edit Task" : "Task Info"}
                placement="top"
                classes={{ tooltip: classes.tooltip }}
              >
                <IconButton
                  color="primary"
                  href={"task/" + value.id}
                  aria-label={tableHead[3]}
                  className={classes.tableActionButton}
                  round>
                  {(user.pub_key === value.creator.pub_key &&
                  <Icon style={{'color': primaryColor[0]}}>edit</Icon>
                  || (
                  <Icon style={{'color': grayColor[0]}}>info</Icon>)
                  )}
                </IconButton>
                {/* <IconButton
                  aria-label="Edit"
                  className={classes.tableActionButton}
                >
                  <Edit
                    className={
                      classes.tableActionButtonIcon + " " + classes.edit
                    }
                  />
                </IconButton> */}
              </Tooltip>
            </TableCell>
            <TableCell className={tableCellClasses}>
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
                  className={classes.tableActionButton}
                  round>
                    <Icon style={{'color': primaryColor[0]}}>play_circle</Icon>)
                </IconButton>
              </Tooltip>
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
