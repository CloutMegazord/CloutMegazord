import React from 'react';
import BitcloutLogin from "react-bitclout-login";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Link from '@material-ui/core/Link';
// import Avatar from '@material-ui/core/Avatar';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import Container from '@material-ui/core/Container';
// import Button from "components/CustomButtons/Button.js";
// import axios from 'axios'

const handleClose = (event, reason, setOpen) => {
	if (reason === 'clickaway') {
		return;
	}
	setOpen(false);
};

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  custloginButton: {
    backgroundColor: '#333',
	color: '#fff'
  }
}));

const LoginIcon = ({ active }) => {
	return (
	//background: active ? '#eee' : '#fff',
	  <div style={{backgroundColor: '#f8f8f8', padding:'2pt', borderRadius: 2, height:'24pt', width: '24pt'}}>
	   <svg scale="0.5" xmlns="http://www.w3.org/2000/svg" width="14pt" height="17pt" viewBox="0 0 24 34" version="1.1">
			<g id="surface1">
			<path  d="M 16.652344 15.230469 L 15.890625 16.207031 L 21.140625 18.820312 L 12.007812 23.574219 L 2.839844 18.8125 L 8.164062 16.179688 L 7.394531 15.207031 L 0 18.867188 L 12.074219 33.992188 L 23.925781 18.867188 Z M 21.453125 20.03125 L 12.0625 32.015625 L 2.464844 19.984375 L 12 24.953125 "/>
			<path d="M 12.007812 0 L 0.0078125 5.941406 L 7.394531 15.207031 L 8.164062 16.179688 L 12.074219 21.078125 L 15.878906 16.214844 L 16.644531 15.242188 L 23.917969 5.953125 Z M 12 1.363281 L 21.132812 5.917969 L 12 10.667969 L 2.839844 5.898438 Z M 15.53125 14.671875 L 14.769531 15.648438 L 12.074219 19.09375 L 9.296875 15.609375 L 8.523438 14.636719 L 2.472656 7.0625 L 12.007812 12.03125 L 21.453125 7.117188 Z M 15.53125 14.671875 "/>
			</g>
		</svg>

	  </div>
	)
}

const CustomLoginWrapper = (component) => (props) => {
  return (
    <component {...props}></component>
  )
}

const SignIn = (props) => {
  const classes = useStyles();
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
	const [errorText, setErrorText] = React.useState(false);
	const api_functions = props.api_functions;
  const component = props.component;
  const autoRedirect = (props.autoRedirect === undefined) ? true : props.autoRedirect;
	const accessLevel = 2;
	const handleSignIn = (e) => {
		api_functions.login({
			jwt: e.jwt,
			publicKey: e.publicKey
		}).then((result) => {
      if (result.data['error']) {
        setErrorText('Login failed: ' + result.data['error'])
			  setErrorOpen(true)
        return
      }
      api_functions
        .signInWithCustomToken(result.data.token)
        .then((userCredential) => {
          if (autoRedirect) {
            window.location.pathname = '/admin/megazordslist';
          }
          setSuccessOpen(true);
        })
        .catch((error) => {
          setErrorText(error.response.message)
			    setErrorOpen(true)
        });
		}).catch((error) => {
			setErrorText('Login failed: ' + error)
			setErrorOpen(true)
		});
	}
  const signInWrapperClick = (e) => {
    if (api_functions.authToken && autoRedirect) {
      e.nativeEvent.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      window.location.pathname = '/admin/megazordslist';
      return
    }
  }
	const handleError = (e) => {

	}
	return (
    <div>
      <Snackbar open={successOpen} autoHideDuration={4000} onClose={(event, reason)=>handleClose(event, reason, setSuccessOpen)}>
        <Alert onClose={(event, reason)=>handleClose(event, reason, setSuccessOpen)} severity="success">
          Success!
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={4000} onClose={(event, reason)=>handleClose(event, reason, setErrorOpen)}>
        <Alert onClose={(event, reason)=>handleClose(event, reason, setErrorOpen)} severity="error">
          Error: {errorText}
        </Alert>
      </Snackbar>
      <div onClickCapture={signInWrapperClick}>
      <BitcloutLogin
        accessLevel={accessLevel}
        onSuccess={handleSignIn}
        onFailure={handleError}
        JWT={true}
        CustomComponent={component}
        customization={{className: classes.custloginButton}}
        customIcon={<LoginIcon/>}
      />
      </div>
  	</div>);
}


// <Container component="main" maxWidth="xs">
// 		<CssBaseline />
// 		<div className={classes.paper}>
// 			<Iframe/>
// 			<div id="loggedin"></div>
// 			{/* <iframe id="identity" frameborder="0" class="" src="https://identity.bitclout.com/embed?v=2" style="display: none;"></iframe> */}
// 			<Avatar className={classes.avatar}>
// 			<LockOutlinedIcon />
// 			</Avatar>
// 			<Typography component="h1" variant="h5">
// 			Sign in
// 			</Typography>
// 			<Button
// 				type="submit"
// 				fullWidth
// 				variant="contained"
// 				color="primary"
// 				className={classes.submit}
// 				onClick={handleSignIn}
// 			>
// 				Sign In with BitClout
// 			</Button>
// 			{/* <form className={classes.form} noValidate>
// 			<TextField
// 				variant="outlined"
// 				margin="normal"
// 				required
// 				fullWidth
// 				name="pass-token"
// 				label="Pass-Token"
// 				type="password"
// 				id="password"
// 				autoComplete="current-password"
// 			/>
// 			<FormControlLabel
// 				control={<Checkbox value="remember" color="primary" />}
// 				label="Remember me"
// 			/>
// 			<Button
// 				type="submit"
// 				fullWidth
// 				variant="contained"
// 				color="primary"
// 				className={classes.submit}
// 			>
// 				Sign In
// 			</Button>
// 			<Grid container>
// 				<Grid item xs>
// 				</Grid>
// 				<Grid item>
// 				<Link href="/sign-up">
// 					{"Don't have an account? Sign Up"}
// 				</Link>
// 				</Grid>
// 			</Grid>
// 			</form> */}
// 		</div>
// 		<Box mt={8}>
// 			<Copyright />
// 		</Box>
// 		</Container>
export default SignIn