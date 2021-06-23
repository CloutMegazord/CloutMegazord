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
import classNames from "classnames";

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
  const [settings, setSettings] = React.useState(user.settings || null);
  if (settings === null && user.settings) {
    setSettings(user.settings)
  }

  const handleSave = (e) => {
    props.setOpenBackdrop(true)
    props.api_functions.saveSettings({...settings})
    .then(res=>{
      props.setOpenBackdrop(false)
    }).catch((error=>{
      props.setOpenBackdrop(false)
    }));
  }
  const handleChange = (name, value) => {
    let settings = {...settings};
    settings[name] = value;
    setSettings(settings)
  }
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Show hidden Megazords</FormLabel> */}
            <FormControlLabel
              control={<Checkbox
                style={{color:primaryColor[0]}}
                checked={settings ? settings.showHidden : false}
                onChange={e => handleChange('showHidden', e.target.checked)}/>}
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
