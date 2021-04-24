import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/auth'

import { firebaseConfig } from './config'

//// Initialize App ////
if(!firebase.apps.length) {
    firease.initializeApp(firebaseConfig)
} else { firebase.app() }

//// Export firebase utils ////
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export const auth = firebase.auth()


//// Google Popup sign-in ////
const GoogleAPI = new firebase.auth.GoogleAuthProvider()
GoogleAPI.setCustomParameters({ prompt: "select_account" })
export const signInWithGoogle = () => auth.signInWithPopup(GoogleAPI)


/// Store / Query user data from firestore DB ////
const handleProfile = async({userAuth, additionalData}) => {
    if (!userAuth) return 
    // Take uid from google sign-in (userAuth) //
    const { uid } = userAuth
    const userRef = firestore.doc(`users/${uid}`)
    // check if user exist //
    const user = await userRef.get()
    if(!user.exists) {
        // Take user info from google sign-in //
        const { displayName, email } = userAuth
        const timestamp = new Date()
        try {
            // Create User //
            userRef.set({
                displayName,
                email,
                createadAt: timestamp,
                ...additionalData,
            })
        } catch (err) { console.log(err); throw err; }
    }
    return userRef
}

// Check if user is authenticated //
const getCurrentUesr = () => {
    return new Promise( (resolve, reject) => {
        const unsub = auth.onStateChanged( userAuth => {
            unsub()
            resolve(userAuth)
        }, reject)
    })
}