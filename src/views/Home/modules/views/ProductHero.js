import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Button from '../components/Button';
import Button from '../../../../components/CustomButtons/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import {
  primaryColor,
  secondaryColor,
  whiteColor,
} from "../../../../assets/jss/material-dashboard-react.js";
import logo from "assets/img/logo_black_big.png";
import workflow from "assets/img/workflow.svg";
// const backgroundImage =
//   'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';
const backgroundImage =
  '/assets/img/freegifmaker.me_2hcVd.gif';

const styles = (theme) => ({
  root:{
    // height: "94vh",
    // width: "94vh"
  },
  background: {
    // backgroundImage: `url(${backgroundImage})`,
    backgroundColor: theme.palette.primary.main, // Average color of the background image.
    backgroundPosition: 'center'
  },
  button: {
    minWidth: 200,
  },
  h5: {
    color: secondaryColor[0],
    backgroundColor: '#22222255',
    padding: '1rem',
    fontWeight: '400',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(1),
    },
  },
  heroInfo: {
    maxWidth: 650,
    fontSize: 21,
    alignSelf: 'flex-end',
    fontStyle: 'italic',
    marginRight: theme.spacing(10),
  },
  more: {
    marginTop: theme.spacing(2),
  },
  subtitle1: {
    fontSize: '28px'
  },
  backgroundSrcInfo: {
    alignSelf: 'flex-end'
  },
  logo: {
    width:'100%',
    height:'100%'
  },
  logoWrapper: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  shadowWrapper: {
    borderRadius: "0 30px 0 0",
    boxShadow: "12px 0 15px -4px rgba(31, 73, 125, 0.8), -12px 0 8px -4px rgba(31, 73, 125, 0.8);",
    overflow: "hidden"
  }
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      <Grid container className={classes.root} spacing={4} >
        <GridItem xs={12} sm={6} >
          <div className={classes.logoWrapper}>
          <div className={classes.shadowWrapper}>
            <img src={logo} className={classes.logo} alt="increase priority" />
          </div>
          <a target="_blank" style={{color:whiteColor}}href="https://bitclout.com/u/charliehilton">logo: @charliehilton</a>
          </div>
        </GridItem>
        <GridItem xs={12} sm={6}>
          <Typography color="inherit" align="center" variant="h4" marked="center" className={classes.title}>
            Revolution in Bitclout cooperation
          </Typography>
          {/* <Typography color="inherit" align="center" variant="subtitle1" className={classes.subtitle1}>
            First distributed account management tool for Bitclout
          </Typography> */}
          <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
            Create a distributed account by splitting high entropy seed phrase between several owners.
          </Typography>
          <img src={workflow}  alt="How it's work?" />
        </GridItem>
      </Grid>
      {/* Increase the network loading priority of the background image. */}
      {/* <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" /> */}



      {/* <Typography color="inherit" align="center" variant="body1" className={classes.heroInfo} align="left">
          For building <b>trustless</b> Bitclout based:
          Foundations, Organizations, Startups, Groups, Incubators or whatever you want.
      </Typography>
      <Typography className={classes.backgroundSrcInfo} color="inherit"
        align="left" variant="caption">
        <a style={{color:secondaryColor[0]}} href="https://www.youtube.com/watch?v=TBHKeRWKqN8" target="_blank" rel="noopener" >
        Background GIF source
        </a>
      </Typography> */}
      {/* <Button
        color="primary"
        variant="contained"
        size="large"
        className={classes.button}
        component="a"
        href="/premium-themes/onepirate/sign-up/"
      >
        Megazord Power
      </Button> */}
      {/* <Typography variant="body2" color="inherit" className={classes.more}>
        Discover the experience
      </Typography> */}
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
