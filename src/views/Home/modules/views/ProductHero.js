import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Button from '../components/Button';
import Button from '../../../../components/CustomButtons/Button';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';
import {
  secondaryColor,
} from "../../../../assets/jss/material-dashboard-react.js";

// const backgroundImage =
//   'https://images.unsplash.com/photo-1534854638093-bada1813ca19?auto=format&fit=crop&w=1400&q=80';
const backgroundImage =
  '/assets/img/freegifmaker.me_2hcVd.gif';

const styles = (theme) => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: '#7fc7d9', // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    color: secondaryColor[0],
    backgroundColor: '#22222255',
    padding: '1rem',
    fontWeight: '400',
    maxWidth: '900px',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  heroInfo: {
    maxWidth: 650,
    fontSize: 21,
    marginBottom: theme.spacing(2),
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
  }
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" />
      <Typography color="inherit" align="center" variant="h3" marked="center" className={classes.title}>
        Revolution in Bitclout cooperation
      </Typography>
      <Typography color="inherit" align="center" variant="subtitle1" className={classes.subtitle1}>
        First distributed account management tool for Bitclout
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        Create a distributed account by splitting high entropy seed phrase between several owners without storing it on server.
      </Typography>
      <Typography color="inherit" align="center" variant="body1" className={classes.heroInfo} align="left">
          For building <b>trustless</b> Bitclout based:
          Foundations, Organizations, Startups, Groups, Incubators or whatever you want.
      </Typography>
      <Typography className={classes.backgroundSrcInfo} color="inherit"
        align="left" variant="caption">
        <a style={{color:secondaryColor[0]}} href="https://www.youtube.com/watch?v=TBHKeRWKqN8" target="_blank" rel="noopener" >
        Background GIF source
        </a>
      </Typography>
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
