/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import Snackbar from "components/Snackbar/Snackbar.js";
import SignIn from 'components/SignIn/SignIn';
import AddAlert from "@material-ui/icons/AddAlert";
import Icon from "@material-ui/core/Icon";
import InfoIcon from "@material-ui/icons/Info";
import { ThemeProvider, createTheme } from "@material-ui/core/styles";

// Firebase.
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseApp, api_functions } from "./firebase_init";

import Admin from "layouts/Admin.js";
import Landing from "layouts/Landing.js";
import Utility from "layouts/Utility.js";
// core components

/**
 * Crypto
 * Buffer.from("dfc4901c82c1f9f758d28368077eb2db7836b7720cfd94ca156fd2192ca25698", 'hex')
 * var myArrays = [ent1, ent2]
// Get the total length of all arrays.
let length = 0;
myArrays.forEach(item => {
  length += item.length;
});

// Create a new array with total length and merge all source arrays.
var mergedArray = new Uint8Array(length);
let offset = 0;
myArrays.forEach(item => {
  mergedArray.set(item, offset);
  offset += item.length;
});

// Should print an array with length 90788 (5x 16384 + 8868 your source arrays)
console.log(mergedArray);
 */
import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      smd: 750,
      md: 1000,
      lg: 1300,
      xl: 1536
    },
  },
});

/**
 * The Splash Page containing the login UI.
 */
class App extends React.Component {
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.PhoneMultiFactorGenerator.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  state = {
    isSignedIn: undefined,
    user: undefined,
    megazords: {},
    redirect: window.location.pathname + window.location.search,
    notifSnak: {
      infoOpen: false,
      errorOpen: false,
      message: "",
    },
    bitcloutData: null,
  };

  /**
   * @inheritDoc
   */
  componentDidMount() {
    var timer;
    var targ = window.location.href.split('/').map(it => '/' + it)
    if (window.location.hostname === 'cloutmegazord.web.app') {
      window.location.hostname = 'cloutmegazord.com';
      return
    }
    api_functions.onError((e) => {
      this.notifSnak("open", "error", e.toString(), 7000);
    });
    const updateIdToken = (userAuth) => {
      userAuth.getIdToken(true).then(function (idToken) {
        api_functions.authToken = idToken;
      });
    }
    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((userAuth) => {
      var self = this;
      if (userAuth) {
        updateIdToken(userAuth);
        setInterval(() => updateIdToken(userAuth), 60*1000)
      }
      const isSignedIn = !!userAuth;
      this.setState({isSignedIn})
      api_functions.getBitcloutData().then(bitcloutData => {
        this.setState({bitcloutData: bitcloutData});
      }).catch(err => {})
      if (isSignedIn) {
        if (targ.includes('/admin') === false && targ.includes('/landing') === false && targ.includes('/u') === false) {
          this.setState({redirect: '/landing/home'});
        } else {
          if (!this.state.user) {
            api_functions.onUserData(userAuth.uid, (userData) => {
              for (let megazordId in userData.megazordsIds) {
                userData.megazords = userData.megazords || {};
                if(self.state.megazords[megazordId]) {
                  userData.megazords[megazordId] = self.state.megazords[megazordId];
                } else {
                  api_functions.onMegazordData(megazordId, userData, (megazordData) => {
                    let megazordsState = self.state.megazords;
                    megazordsState[megazordData.id] = megazordData;
                    self.setState({megazords: megazordsState});
                    let userState = self.state.user;
                    userState.megazords = userState.megazords || {};
                    userState.megazords[megazordData.id] = megazordData;
                    self.setState({user: userState});
                  })
                }
              }
              this.setState({user: userData});
            })
          }
        }
      } else {
        if (targ.includes('/admin') || (window.location.pathname === '/')) {
          this.setState({redirect: '/landing/home'});
        }
        api_functions.authToken = null;
        api_functions.onErrorSubscribers = [];
      }
    });
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.unregisterAuthObserver();
    api_functions.onErrorSubscribers = [];
  }

  notifSnak(action, type, message, duration) {
    let isOpen = action === "open" ? true : false;
    let notifSnak = this.state.notifSnak;
    for (let k in notifSnak) {
      if (notifSnak[k] === true) {
        notifSnak[k] = false;
      }
    }
    notifSnak[type + "Open"] = isOpen;
    notifSnak.message = message || "";
    this.setState({ notifSnak: notifSnak });
    if (action === "open" && duration) {
      const self = this;
      setTimeout(() => {
        for (let k in notifSnak) {
          if (notifSnak[k] === true) {
            notifSnak[k] = false;
          }
        }
        notifSnak.message = "";
        self.setState({ notifSnak: notifSnak });
      }, duration);
    }
  }

  validatePath() {
    var targ = window.location.href.split("/").map((it) => "/" + it);
    return targ.includes("/admin");
  }

  /**
   * @inheritDoc
   */
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router history={hist}>
          <Switch>
            <Route path="/landing">
              <Landing api_functions={api_functions}></Landing>
            </Route>
            <Route path="/u">
              <Utility api_functions={api_functions} user={this.state.user}></Utility>
            </Route>
            {/* <Route path="/admin" component={Admin} />
            <Redirect from="/" to="/admin/dashboard" /> */}
            {/* {this.state.isSignedIn === true && */}
            <Route path="/admin">
              <Admin
                api_functions={api_functions}
                user={this.state.user}
                bitcloutData={this.state.bitcloutData}
                indexFunctons={{ notifSnak: this.notifSnak.bind(this) }}
              />
            </Route>
            {/* } */}
          </Switch>
          {this.state.isSignedIn !== undefined && (
            <Redirect to={this.state.redirect} />
          )}
        </Router>
        <Snackbar
          place="tc"
          color="danger"
          icon={AddAlert}
          message={this.state.notifSnak.message}
          open={this.state.notifSnak.errorOpen}
          autoHideDuration={1000}
          closeNotification={() => this.notifSnak("close", "error")}
          close
        />
        <Snackbar
          place="tc"
          color="info"
          icon={InfoIcon}
          message={this.state.notifSnak.message}
          open={this.state.notifSnak.infoOpen}
          autoHideDuration={1000}
          closeNotification={() => this.notifSnak("close", "info")}
          close
        />
        {/* <Snackbar open={this.state.errorOpen} autoHideDuration={4000} onClose={(event, reason)=>this.handleErrorClose(event, reason)}>
          <Alert onClose={(event, reason)=>handleClose(event, reason, setErrorOpen)} severity="error">
            Error: {errorText}
          </Alert>
        </Snackbar> */}
      </ThemeProvider>
    );
    // <div className={styles.container}>
    //   <div className={styles.logo}>
    //     <i className={styles.logoIcon + ' material-icons'}>photo</i> My App
    //   </div>
    //   <div className={styles.caption}>This is a cool demo app</div>
    //   {this.state.isSignedIn !== undefined && !this.state.isSignedIn &&
    //     <div>
    //       <StyledFirebaseAuth className={styles.firebaseUi} uiConfig={this.uiConfig}
    //                           firebaseAuth={firebaseApp.auth()}/>
    //     </div>
    //   }
    //   {this.state.isSignedIn &&
    //     <div className={styles.signedIn}>
    //       Hello {firebaseApp.auth().currentUser.displayName}. You are now signed In!
    //       <a className={styles.button} onClick={() => firebaseApp.auth().signOut()}>Sign-out</a>
    //     </div>
    //   }
    // </div>
  }
}
ReactDOM.render(<App></App>, document.getElementById("root"));
//   <Router history={hist}>
//     <Switch>
//       <Route path="/admin" component={Admin} />
//       <Route path="/rtl" component={RTL} />
//       <Redirect from="/" to="/admin/dashboard" />
//     </Switch>
//   </Router>,
//   document.getElementById("root")
// );
