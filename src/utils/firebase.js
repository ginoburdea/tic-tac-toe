import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
    collection,
    connectFirestoreEmulator,
    getFirestore,
} from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'
import buildCloudFunction from './buildCloudFunction'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const firestore = getFirestore(app)
export const roomsCollection = collection(firestore, 'rooms')

export const auth = getAuth(app)

export const functions = getFunctions(app)
export const cloudLeaveRoom = buildCloudFunction(functions, 'leaveRoom')
export const cloudCreateRoom = buildCloudFunction(functions, 'createRoom')
export const cloudJoinRoom = buildCloudFunction(functions, 'joinRoom')
export const cloudMakeAMove = buildCloudFunction(functions, 'makeAMove')
export const cloudPlayAgain = buildCloudFunction(functions, 'playAgain')

if (import.meta.env.DEV) {
    connectFirestoreEmulator(firestore, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9090')
    connectFunctionsEmulator(functions, 'localhost', 7070)
}
