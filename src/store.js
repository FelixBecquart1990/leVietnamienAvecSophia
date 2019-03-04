import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import firebase from './firebaseConfig.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    snackbar: { active: false, color: "", mode: "", timeout: 0, text: "" },
    user: null,
    currentUser: {},
    lessons: [],
    selectedLesson: {},
    lessonCategory: {
      name: "expert",
      title: "Expert"
    },
    loading: false,
    emailSent: false
  },
  mutations: {
    setUser(state, val) {
      state.user = val
    },
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setEmailSent(state, val) {
      state.emailSent = val
    },
    setSnackbar(state, val) {
      state.snackbar = Object.assign({}, val, { active: true })
    },
    setLessons(state, val) {
      state.lessons = val
    },
    addLesson(state, val) {
      state.lessons.push(val)
    },
    setLoading(state, val) {
      state.loading = val
    },
    setLessonCategory(state, val) {
      state.lessonCategory = val
    },
    setSelectedLesson(state, val) {
      state.selectedLesson = val
    },
  },
  actions: {
    getLessons({ state, commit }) {
      firebase.firestore().collection('lessons').onSnapshot(function (querySnapshot) {
        let lessons = [];
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          lessons.push(Object.assign({}, doc.data(), { uid: doc.id }))
        });
        commit('setLessons', lessons)
        console.log("lessons:", lessons)
      }, function (error) {
        console.log(err)
      })
    },
    createLesson({ state, commit }, payload) {
      commit("setLoading", true)
      firebase.firestore().collection('lessons').add(payload)
        .then(function (doc) {
          let newLesson = Object.assign({}, payload, { uid: doc.id })
          // commit('addLesson', newLesson)
          commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "Bravo Sophia, ta leçon a été créée 🐣"
          });
          commit('setSelectedLesson', newLesson)
          router.push("/lessons")
          commit("setLoading", false)
        })
        .catch(function (error) {
          commit("setSnackbar", {
            color: "error",
            timeout: 3000,
            text: "La leçon n'a pas pu être sauvegardée 🤯"
          });
          commit("setLoading", false)
        });
    },
    deleteLesson({ state, commit }, payload) {
      commit("setLoading", true)
      firebase.firestore().collection('lessons').doc(payload.uid).delete().then(function () {
        router.push("/")
        commit("setSnackbar", {
          color: "success",
          timeout: 3000,
          text: "La leçon a bien été supprimée 🐣"
        });
        // let lessons = state.lessons.filter(lesson => lesson.uid != payload.uid);
        // commit('setLessons', lessons)
        commit("setLoading", false)
      }).catch(function (error) {
        console.log(error)
        commit("setLoading", false)
      });
    },
    updateLesson({ state, commit }, payload) {
      commit("setLoading", true)
      firebase.firestore().collection('lessons')
        .doc(payload.uid)
        .update(payload).then(function () {
          commit("setLoading", false)
          commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "Les modifications ont été sauvegardées 💃"
          });
        })
        .catch(err => {
          commit("setLoading", false)
          console.log(err);
        });
    },
    // ----------- LOGIN AUTOMATICALLY WHEN ALREADY LOGGED FROM LAST VISIT ------------ //
    autoLogin({ state, commit, dispatch }) {
      if (!state.user) return
      firebase.firestore().collection('users').doc(state.user.uid).onSnapshot(doc => {
        commit('setUser', doc.data())
        console.log("user:", doc.data())
      })
    },

    // // ----------- UPDATE DATA OF A USER ------------ //
    // updateDataUser({ state, commit }, payload) {
    //   commit("setLoading", true)
    //   fb.usersCollection.doc(state.user.uid).update(payload).then(function () {
    //     commit("setLoading", false)
    //     commit("setSnackbar", {
    //       color: "success",
    //       timeout: 3000,
    //       text: "Modifications du profil sauvegardées"
    //     });
    //   })
    //     .catch(function (error) {
    //       commit("setLoading", false)
    //       console.error("Error adding document: ", error);
    //     });
    // },

    // // ----------- LOGOUT FROM THE APP ------------ //
    // logout({ state, commit }) {
    //   firebase.auth.signOut()
    //     .then(() => {
    //       commit("setUser", null);
    //       router.push("/");
    //       commit("setSnackbar", {
    //         color: "success",
    //         timeout: 3000,
    //         text: "Vous avez bien été déconnecté"
    //       });
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },

    fetchUser({ commit, state, dispatch }, payload) {
      firebase.firestore().collection('users').doc(payload.uid).get().then(user => {
        commit('setUser', user.data())
        console.log("user from Firestore:", state.user)
      }).catch(err => {
        console.log(err)
      })
    },

    linkWithEmail({ commit, state, dispatch }, payload) {
      commit("setLoading", true)
      var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: 'http://vietnamesewithsophia.firebaseapp.com',
        // This must be true.
        handleCodeInApp: true,
        
      };

      firebase.auth().sendSignInLinkToEmail(payload, actionCodeSettings)
        .then(function () {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', payload);
          commit('setEmailSent', true)
          commit("setLoading", false)
        })
        .catch(function (error) {
          console.log(error)
          commit("setLoading", false)
          // Some error occurred, you can inspect the code: error.code
        });
    },
    /*
    ça ne va pas avec Ngan, pas bon travail
    franchemenet client compliqué communiquer Ngan
    Français pas suffisement bon
    On échange des mauvaises informations.

    Du coup, je suis obligé d'échanger directement avec le client... pas mon taf
    */

    // ----------- SIGNUP FACEBOOK IF NEW USER, OR THEN JUST LOGIN AND RETRIEVE DATA ------------ //
    // linkToFacebook({ state, commit, getters, dispatch }) {
    //   commit("setLoading", true)
    //   var provider = new fb.firebase.auth.FacebookAuthProvider();
    //   fb.auth.currentUser.linkWithRedirect(provider);

    // },
    // unlinkFromFacebook({ state, commit, getters, dispatch }) {
    //   commit("setLoading", true)
    //   if (!fb.auth.currentUser.providerData[0]) return commit("setLoading", false)
    //   fb.auth.currentUser.unlink(fb.auth.currentUser.providerData[0].providerId).then(function () {
    //     // Auth provider unlinked from account
    //     router.push("/")

    //     let newUser = {
    //       uid: state.user.uid,
    //       photoURL: null,
    //       displayName: null
    //     }
    //     commit('setUser', newUser)
    //     fb.usersCollection.doc(fb.auth.currentUser.uid).update(newUser).then(function () {
    //       commit("setSnackbar", {
    //         color: "success",
    //         timeout: 3000,
    //         text: "Votre compte a bien été délié de Facebook"
    //       });
    //       commit("setLoading", false)
    //     })
    //   }).catch(function (error) {
    //     // An error happened
    //     console.log(error)
    //     commit("setLoading", false)
    //   });

    // }
  }
})
