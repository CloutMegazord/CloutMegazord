import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const signUpRequst = (e, props, setSuccess, setError, setErrorText) => {
	e.preventDefault();
  const api_signup = props.api_signup
	const userName = document.getElementById('bitclout_username').value
	if (!userName) {return}
  api_signup({userName}).then((result) => {
    alert(result.data)
    setSuccess(true)
  }).catch((error) => {
    setErrorText('Accaount with username: "@' +userName+ '" not found.')
    setError(true)
  });
	// axios.post('/api/signUp', {
  //   bitcloutUserName: userName
  // })
  // .then(function (response) {
	// 	setSuccess(true)
  // })
  // .catch(function (error) {
	// 	setErrorText('Accaount with username: "@' +userName+ '" not found.')
	// 	setError(true)
  // });
}

const handleClose = (event, reason, setOpen) => {
	if (reason === 'clickaway') {
		return;
	}

	setOpen(false);
};

const SignUp = (props) => {
  const classes = useStyles();
	const [error, setError] = React.useState(false);
	const [errorText, setErrorText] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

  return (
    <Container component="main" maxWidth="xs">
			<Snackbar open={success} autoHideDuration={20000} onClose={(event, reason)=>handleClose(event, reason, setSuccess)}>
        <Alert onClose={(event, reason)=>handleClose(event, reason, setSuccess)} severity="success">
          Success! Go to <Link target="_blank" rel="noopener" href="https://bitclout.com/inbox">BitClout Messages</Link>.
					And check message from <Link href="https://bitclout.com/u/CloutMegazord">@CloutMegazord</Link>.
        </Alert>
      </Snackbar>
			<Snackbar open={error} autoHideDuration={5000} onClose={(event, reason)=>handleClose(event, reason, setSuccess)}>
        <Alert onClose={(event, reason)=>handleClose(event, reason, setSuccess)} severity="error">
          Error: {errorText}
        </Alert>
      </Snackbar>
			{/* <Alert variant="filled" severity="error">
  			This is an error alert — check it out!
			</Alert>
			<Alert variant="filled" severity="success">
				This is a success alert — check it out!
			</Alert> */}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="bitclout_username"
                label="Bitclout Username"
                name="bitclout_username"
              />
            </Grid>
          </Grid>
          <Button
            onClick={(e) => { signUpRequst(e, props, setSuccess, setError, setErrorText) }}
            fullWidth
						type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/sign-in">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignUp