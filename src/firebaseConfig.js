import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

// firebase init
const config = {
    apiKey: "AIzaSyBGteMkXMcD42ZzCrJGcp1bOX9TT_aeReo",
    authDomain: "vietnamesewithsophia.firebaseapp.com",
    databaseURL: "https://vietnamesewithsophia.firebaseio.com",
    projectId: "vietnamesewithsophia",
    storageBucket: "vietnamesewithsophia.appspot.com",
    messagingSenderId: "24254250679"
}

firebase.initializeApp(config)

export default firebase
