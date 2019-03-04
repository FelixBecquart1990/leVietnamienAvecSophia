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
    loading: false
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
    // ----------- SIGNUP FACEBOOK IF NEW USER, OR THEN JUST LOGIN AND RETRIEVE DATA ------------ //
    facebookSignup({ state, commit, getters, dispatch }) {
      var provider = new firebase.auth.FacebookAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          if (result.additionalUserInfo.isNewUser) {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            // var token = result.credential.accessToken;
            // The signed-in user info.
            var facebookUser = result.user;
            // ...
            console.log(result.user);
            let user = {};
            user = {
              uid: facebookUser.uid,
              displayName: facebookUser.displayName,
              email: facebookUser.email,
              photoURL: facebookUser.photoURL
            };
            commit("setUser", user);
            // router.push("/")
            commit("setSnackbar", {
              color: "success",
              timeout: 3000,
              text: "Votre compte est maintenant lié à Facebook"
            });
            console.log("signup sucess")
            firebase.firestore()
              .collection("users").doc(facebookUser.uid)
              .set(user).then(
                firebase.firestore().collection("users").doc(user.uid).onSnapshot(doc => {
                  commit('setUser', doc.data())
                  console.log(doc.data())
                })
              )
              .catch(error => {
                console.log(error);
              });
          } else {
            console.log("before auto login")
            firebase.firestore().collection("users").doc(result.user.uid).onSnapshot(doc => {
              commit('setUser', doc.data())
              commit("setSnackbar", {
                color: "success",
                timeout: 3000,
                text: "Votre compte est maintenant lié à Facebook"
              });
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // ----------- LOGOUT FROM THE APP ------------ //
    logout({ state, commit }) {
      firebase.auth()
        .signOut()
        .then(() => {
          commit("setUser", null);
          router.push("/");
          commit("setSnackbar", {
            color: "success",
            timeout: 3000,
            text: "Vous avez bien été déconnecté"
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
})
