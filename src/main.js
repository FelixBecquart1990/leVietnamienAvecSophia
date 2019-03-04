import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from './firebaseConfig.js'
import './registerServiceWorker'

Vue.config.productionTip = false

let app
firebase.auth().onAuthStateChanged(user => {
  console.log(user)
  store.commit("setUser", user);
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})
