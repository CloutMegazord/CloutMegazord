import { createTheme } from '@material-ui/core/styles';
import { green, grey, red } from '@material-ui/core/colors';
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
  hexToRgb
} from "../../../assets/jss/material-dashboard-react.js";

const rawTheme = createTheme({
  palette: {
    primary: {
      light: '#69696a',
      main: '#0a1b23',
      dark: '#1e1e1f'
    },
    // primary: {
    //   light: primaryColor[0],
    //   main: primaryColor[1],
    //   dark: primaryColor[3],
    // },
    secondary: {
      light: secondaryColor[0],
      main: secondaryColor[0],
      dark: secondaryColor[3],
    },
    blueWhite: {
      light: '#fafafa',
      main: '#e3f2fd',
      dark: '#90caf9'
    },
    warning: {
      main: warningColor[0],
      dark: warningColor[2],
    },
    error: {
      xLight: dangerColor[0],
      main: dangerColor[1],
      dark: dangerColor[3],
    },
    success: {
      xLight: successColor[0],
      main: successColor[1],
      dark: successColor[3],
    },
  },
  typography: {
    fontFamily: "'Work Sans', sans-serif",
    fontSize: 14,
    fontWeightLight: 300, // Work Sans
    fontWeightRegular: 400, // Work Sans
    fontWeightMedium: 700, // Roboto Condensed
    fontFamilySecondary: "'Roboto Condensed', sans-serif",
  },
});

const fontHeader = {
  color: rawTheme.palette.text.primary,
  fontWeight: rawTheme.typography.fontWeightMedium,
  fontFamily: rawTheme.typography.fontFamilySecondary,
  textTransform: 'uppercase',
};

const theme = {
  ...rawTheme,
  palette: {
    ...rawTheme.palette,
    background: {
      ...rawTheme.palette.background,
      default: rawTheme.palette.common.white,
      placeholder: grey[200],
    },
  },
  typography: {
    ...rawTheme.typography,
    fontHeader,
    h1: {
      ...rawTheme.typography.h1,
      ...fontHeader,
      letterSpacing: 0,
      fontSize: 60,
    },
    h2: {
      ...rawTheme.typography.h2,
      ...fontHeader,
      fontSize: 48,
    },
    h3: {
      ...rawTheme.typography.h3,
      ...fontHeader,
      fontSize: 42,
    },
    h4: {
      ...rawTheme.typography.h4,
      ...fontHeader,
      fontSize: 'max(3vw, 20px)',//36
    },
    h5: {
      ...rawTheme.typography.h5,
      fontSize: 'max(2vw, 20px)',//20
      fontWeight: rawTheme.typography.fontWeightLight,
    },
    h6: {
      ...rawTheme.typography.h6,
      ...fontHeader,
      fontSize: 18,
    },
    subtitle1: {
      ...rawTheme.typography.subtitle1,
      fontSize: 18,
    },
    body1: {
      ...rawTheme.typography.body2,
      fontWeight: rawTheme.typography.fontWeightRegular,
      fontSize: 'max(1vw, 16px)',//,
    },
    body2: {
      ...rawTheme.typography.body2,
      fontSize: 'max(.7vw, 14px)',//,
    }
  },
};

export default theme;
