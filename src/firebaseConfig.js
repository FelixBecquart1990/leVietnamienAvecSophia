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

// // firebase utils
const firestore = firebase.firestore()
// const messaging = firebase.messaging()
const auth = firebase.auth()
const currentUser = auth.currentUser
// //console.log(messaging)

// date issue fix according to firebase
// const settings = {
//     timestampsInSnapshots: true
// }
// firebase.firestore().settings({ timestampsInSnapshots: true })

// firebase collections
const usersCollection = firebase.firestore().collection('users')
const lessonsCollection = firebase.firestore().collection('lessons')
// const ideasCollection = db.collection('ideas')


export default firebase
// export {
//     firebase,
//     firestore,
//     auth,
//     currentUser,
//     usersCollection,
//     lessonsCollection,
//     // ideasCollection,
//     // messaging
// }
