import firebase from 'firebase'

// it's public anyways :)
const config = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_messagingSenderId,
    appId: process.env.VUE__APP_appId,
}

firebase.initializeApp(config)

firebase.firestore()

export default firebase
