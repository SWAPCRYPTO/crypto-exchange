import firebase from 'firebase'

const config = {
    // apiKey: process.env.VUE_APP_apiKey,
    // authDomain: process.env.VUE_APP_authDomain,
    // projectId: process.env.VUE_APP_projectId,
    // storageBucket: process.env.VUE_APP_storageBucket,
    // messagingSenderId: process.env.VUE_APP_messagingSenderId,
    // appId: process.env.VUE__APP_appId,
    apiKey: 'AIzaSyBiC0udW4lthdkpbwPH1FjWn8brpR88-as',
    authDomain: 'cryptoexchange-184fa.firebaseapp.com',
    projectId: 'cryptoexchange-184fa',
    storageBucket: 'cryptoexchange-184fa.appspot.com',
    messagingSenderId: '453214051140',
    appId: '1:453214051140:web:e15703622560f052c01511',
}

firebase.initializeApp(config)

firebase.firestore()

export default firebase
