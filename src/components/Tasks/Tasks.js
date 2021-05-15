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

  // addedBy:
  // CoinEntry: {CreatorBasisPoints: 10000, BitCloutLockedNanos: 0, NumberOfHolders: 0, CoinsInCirculationNanos: 0, CoinWatermarkNanos: 1792583638}
  // CoinPriceBitCloutNanos: 0
  // Comments: null
  // Description: "First distributed account management tool for Bitclout.\n\nRunner Up of Product-a-Thon 1.0 (bclout.link/4o3)\n\ncloutmegazord.web.app\n\nCreator:@transhumanist"
  // IsHidden: false
  // IsReserved: false
  // IsVerified: false
  // Posts: null
  // ProfilePic: "data:image/jpeg;base64,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"
  // PublicKeyBase58Check: "BC1YLfkW18ToVc1HD2wQHxY887Zv1iUZMf17QHucd6PaC3ZxZdQ6htE"
  // StakeEntryStats: {TotalStakeNanos: 0, TotalStakeOwedNanos: 0, TotalCreatorEarningsNanos: 0, TotalFeesBurnedNanos: 0, TotalPostStakeNanos: 0}
  // StakeMultipleBasisPoints: 12500
  // Username: "CloutMegazord"
  // UsersThatHODL: null
  // __proto__: Object
  // date: 1621011406584
  // description: "Lounch this task for activate account and get public key"
  // id: "-M_fnlxLpJKTpHs2iQF3"
  // type: "getPublicKey"
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
  const { tasks, user, rtlActive, tableHeaderColor } = props;
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
              {value.addedBy === user.id ? (
                <Tooltip
                  id="tooltip-top"
                  title="Edit Task"
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton
                    color="primary"
                    href={"task/" + value.id}
                    aria-label={tableHead[3]}
                    className={classes.tableActionButton}
                    >
                      <Icon style={{'color': secondaryColor[0]}}>edit</Icon>
                    </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  id="tooltip-top"
                  title="Task Info"
                  placement="top"
                  classes={{ tooltip: classes.tooltip }}
                >
                  <IconButton
                    color="primary"
                    href={"task/" + value.id}
                    aria-label={tableHead[3]}
                    className={classes.tableActionButton}
                  >
                    <Icon style={{'color': grayColor[0]}}>info</Icon>
                  </IconButton>
                </Tooltip>
              )}
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
                  >
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
