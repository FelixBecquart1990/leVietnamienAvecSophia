import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
// const fb = require('./firebaseConfig.js')
import firebase from './firebaseConfig.js'

import './registerServiceWorker'

Vue.config.productionTip = false

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')






let app
firebase.auth().onAuthStateChanged(user => {
  // linkAndRetrieveDataWithCredential()
  console.log("user from firebase:", user)
  store.commit("setCurrentUser", user);
  store.commit("setLoading", true);
  // if user, get user information
  if (user) {
    store.dispatch("fetchUser", user);
    store.commit("setLoading", false);
  }
  // if no user, create anonymous user
  else {
    firebase.auth()
      .signInAnonymously()
      .then(cred => {
        store.commit("setUser", cred.user);
        firebase.firestore().collection('users')
          .doc(cred.user.uid)
          .set({
            uid: cred.user.uid
          })
          .then(() => {
            store.commit("setLoading", false);
          })
          .catch(err => {
            console.log(err);
            store.commit("setLoading", false);
          });
      })
      .catch(function (error) {
        console.log(error);
        store.commit("setLoading", false);
      });
  }
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})


// function linkAndRetrieveDataWithCredential() {
//   // Confirm the link is a sign-in with email link.
//   if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
//     console.log("window.location.href:", window.location.href)
//     var email = window.localStorage.getItem('emailForSignIn');
//     if (!email) {
//       // User opened the link on a different device. To prevent session fixation
//       // attacks, ask the user to provide the associated email again. For example:
//       email = window.prompt('Please provide your email for confirmation');
//     }
//     if (email) {
//       // Construct the email link credential from the current URL.
//       var credential = firebase.auth.EmailAuthProvider.credentialWithLink(
//         email, window.location.href);
//       // Link the credential to the current user.
//       firebase.auth().currentUser.linkAndRetrieveDataWithCredential(credential)
//         .then(function (usercred) {
//           // Clear the URL to remove the sign-in link parameters.
//           // Clear email from storage.
//           // if (history && history.replaceState) {
//           //   window.history.replaceState({}, document.title, window.location.href.split('?')[0]);
//           // }
//           // router.push("/")
//           window.localStorage.removeItem('emailForSignIn');
//           console.log("The provider is now successfully linked.")
//           store.commit("setSnackbar", {
//             color: "success",
//             timeout: 3000,
//             text: "Votre compte a bien été lié à votre adresse email"
//           });

//         })
//         .catch(function (error) {
//           console.log(error)
//         });
//     }

//   }
// }