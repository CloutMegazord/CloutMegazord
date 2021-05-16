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

// Firebase.
import firebase from 'firebase/app';
import 'firebase/auth';
import { firebaseApp, api_functions} from './firebase_init';

import Admin from "layouts/Admin.js";
import Landing from "layouts/Landing.js";
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
    user: undefined,
    redirect: window.location.pathname
  };

  /**
   * @inheritDoc
   */
  componentDidMount() {
    // var targ = window.location.href.split('/').map(it => '/' + it);
    // if (targ.includes('/taskSessions')) {
    //   api_functions.getTaskSession().then(resp => {
    //     var doc = document.implementation.createHTMLDocument(""+(document.title || ""));

    //     doc.open();
    //     doc.write(resp.data);
    //     doc.close();

    //     var scripts = doc.getElementsByTagName("script");
    //     //Modify scripts as you please
    //     [].forEach.call( scripts, function( script ) {
    //         script.removeAttribute("src");
    //         script.remove();
    //     });
    //     //Doing this will activate all the modified scripts and the "old page" will be gone as the document is replaced
    //     document.replaceChild( document.importNode(doc.documentElement, true), document.documentElement);

    //   });
    //   return
    // }

    this.unregisterAuthObserver = firebaseApp.auth().onAuthStateChanged((userAuth) => {
      const isSignedIn = !!userAuth;
      this.setState({isSignedIn})
      if (isSignedIn) {
        api_functions.onUserData(userAuth.uid, (user) => {
          this.setState({user: user});
          var targ = window.location.href.split('/').map(it => '/' + it)
          if (targ.includes('/admin') === false && targ.includes('/taskSessions') === false ) {
            this.setState({redirect: '/admin/megazordslist'});
          }
        })
      } else {
        this.setState({redirect: '/landing/home'});
      }
    });
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  validatePath() {
    var targ = window.location.href.split('/').map(it => '/' + it);
    return targ.includes('/admin');
  }

  /**
   * @inheritDoc
   */
  render() {
    return (
      <Router history={hist}>
        <Switch>
          <Route path="/landing">
            <Landing api_functions={api_functions}></Landing>
            {/* <Landing firebaseAuth={firebaseApp.auth()} api_signin={api_functions.signIn}/> */}
          </Route>
          {/* <Route path="/admin" component={Admin} />
          <Redirect from="/" to="/admin/dashboard" /> */}
          {this.state.isSignedIn === true &&
            <Route path="/admin">
              <Admin api_functions={api_functions} user={this.state.user}></Admin>
            </Route>
          }
        </Switch>
        {this.state.isSignedIn !== undefined &&
          <Redirect to={this.state.redirect} />
        }
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
