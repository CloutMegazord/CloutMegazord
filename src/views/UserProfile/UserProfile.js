import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from "components/CustomButtons/Button.js";

import avatar from "assets/img/faces/marc.jpg";
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
  hexToRgb,
  defaultFont
} from "assets/jss/material-dashboard-react.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);

export default function UserProfile(props) {
  const classes = useStyles();
  const user = props.user || {};
  if (!user) {
    props.setOpenBackdrop(true)
  }
  const handleSave = (e) => {
    props.api_functions.saveSettings({showHidden:showHidden});
  }
  const handleChange = (e, set) => {
    set(e.target.checked);
  }
  var settings = user.settings || {showHidden: false};
  const [showHidden, setShowHidden] = React.useState(settings.showHidden);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Show hidden Megazords</FormLabel> */}
            <FormControlLabel
              value={settings.showHidden}
              control={<Checkbox style={{color:primaryColor[0]}} onChange={e => handleChange(e, setShowHidden)}/>}
              label="Show hidden Megazords"
              labelPlacement="start"
            />
            </FormControl>
        </GridItem>
       </GridContainer>
       <Button autoFocus onClick={handleSave} color="primary">
        Save
      </Button>
    </div>
  );
}
