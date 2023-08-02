import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { useRouter } from 'vue-router'

import { ref, onUnmounted, computed } from 'vue'

firebase.initializeApp({
    apiKey: "AIzaSyD__7ULaWztR-lZfRZtBfbHE_nPTUo93cw",
    authDomain: "airy-c2f79.firebaseapp.com",
    projectId: "airy-c2f79",
    storageBucket: "airy-c2f79.appspot.com",
    messagingSenderId: "957779706012",
    appId: "1:957779706012:web:1a49375964a5befbd0ad59",
    measurementId: "G-VVGTQ9XVP4"
})

const auth = firebase.auth()

// use auth hook to sign in and out
export function useAuth() {
    const user = ref(null)
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value = _user))
    onUnmounted(unsubscribe)
    const isLoggedIn = computed(() => user.value !== null)
    const signIn = async () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(googleProvider)
    }
    const signOut = () => {
        auth.signOut()
    }
    return { user, isLoggedIn, signIn, signOut }
}

// use firestore hook to get data

const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)

export function useChat() {
    const messages = ref([])
    const unsubscribe = messagesQuery.onSnapshot(snapshot => {
        messages.value = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .reverse()
    })
    onUnmounted(unsubscribe)

    const { user, isLoggedIn } = useAuth()
    const sendMessage = text => {
        if (!isLoggedIn.value) return
        const { photoURL, uid, displayName } = user.value
        messagesCollection.add({
            userName: displayName,
            userId: uid,
            userPhotoURL: photoURL,
            text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }
    return { messages, sendMessage }
}


