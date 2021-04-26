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
import { Router, Route, Switch, Redirect } from "react-router-dom";

// Firebase.
import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseApp, auth, api_functions } from './firebase_init';

import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import SignIn from "components/SignIn/SignIn.js"
import SignUp from "components/SignUp/SignUp.js"

// core components

import "assets/css/material-dashboard-react.css?v=1.9.0";

const hist = createBrowserHistory();
/**
 * The Splash Page containing the login UI.
 */
 class App extends React.Component {
  uiConfig = {
    signInFlow: 'popup',
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
  };

  /**
   * @inheritDoc
   */
  componentDidMount() {
    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((user) => {
      this.setState({isSignedIn: !!user});
    });
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  /**
   * @inheritDoc
   */
  render() {
    return (
        <Router history={hist}>
          <Switch>
            <Route path="/sign-in">
              <SignIn firebaseAuth={firebaseApp.auth()} api_signin={api_functions.signIn}/>
            </Route>
            <Route path="/sign-up">
              <SignUp firebaseAuth={firebaseApp.auth()} api_signup={api_functions.signUp}/>
            </Route>
            <Route path="/admin" component={Admin} />
            <Redirect from="/" to="/admin/dashboard" />
            {this.state.isSignedIn &&
              <Route path="/admin" component={Admin} />
            }
            {!this.state.isSignedIn &&
              <Redirect from="/" to="/sign-in" />
            }
            {this.state.isSignedIn &&
               <Redirect from="/" to="/admin/dashboard" />
            }
          </Switch>
        </Router>
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
