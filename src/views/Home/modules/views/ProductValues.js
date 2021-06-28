import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '../components/Typography';

const styles = (theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(30),
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  image: {
    height: 55,
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
  }
});

function ProductValues(props) {
  const { classes } = props;

  return (
    <section className={classes.root} id='product'>
      <Container maxWidth={false} className={classes.container}>
        <img
          src="/static/themes/onepirate/productCurvyLines.png"
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src="/static/themes/onepirate/security_black_24dp.svg"
                alt="suitcase"
              />
              <Typography variant="h6" className={classes.title}>
                Security
              </Typography>
              <Typography variant="h5">
                Separate <a target="_blank" href="https://github.com/CloutMegazord/signing-cloutmegazord">Open source </a>
                Infrastruction for handling Seed Phrases Parts.
                Proof of identical between the open source and server code (Transparent backend).
                Provide your gmail to <a target="_blank" href="https://bitclout.com/u/CloutMegazord">@CloutMegazord</a> for requesting Read Only access to server code.
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src="/static/themes/onepirate/call_split_black_24dp.svg"
                alt="clock"
              />
              <Typography variant="h6" className={classes.title}>
                Fault tolerance
              </Typography>
              <Typography variant="h5">
                {'Funds will not be lost even if the CloutMegazord service is offline. '}
                {' The parts of the seed phrase that you generated when creating a new joint account are a full-fledged private key. '}
                {'They can be contacted by the owners without CloutMegazord.'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <img
                className={classes.image}
                src="/static/themes/onepirate/productValues1.svg"
                alt="graph"
              />
              <Typography variant="h6" className={classes.title}>
                Simplicity
              </Typography>
              <Typography variant="h5">
                {'Anything extra. '}
                You don't need to provide an email, name, etc. Just login via BitClout (JWT token) and use it. A simple interface which you will quickly get used to.
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

ProductValues.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);
