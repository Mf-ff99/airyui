import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

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

    const isFirstTimeLogin = computed(() => {
      if (user.value.metadata.creationTime == user.value.metadata.lastSignInTime) {
        return true
      } else { return false } })

    const signIn = async () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        await auth.signInWithPopup(googleProvider)
        if (isFirstTimeLogin.value) {
          const { uid } = user.value
          await firestore.collection('users').doc(uid).set({
            userId: uid,
            userProfileStatus: 'hey, im the default text! look at me, im a noob!!',
            messagesSent: 0,
            userRole: 'user',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
        }
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
const usersCollection = firestore.collection('users')
// const usersQuery = usersCollection.orderBy('createdAt', 'desc').limit(1)

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
      const { uid, displayName } = user.value
      messagesCollection.add({
        userName: displayName,
        userId: uid,
        text: text,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    }

    // const getUserInfo = (userId) => {
    //   const userInfo = ref([])
    //   const unsubscribe = usersCollection.get().then(snapshot => {
    //     const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    //     console.log(users, 'users')
    //   }).catch(console.error)
    //   onUnmounted(unsubscribe)
    //   return { userInfo }
    // }

    const userProfileInfo = ref([])

    const getUserInfo = async (userId) => {
      const unsubscribe = usersCollection.get().then(snapshot => {
        userProfileInfo.value = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
      })
      // userMessages.value = userMessages.value.filter(message => message.userId === userId)
      onUnmounted(unsubscribe)
      return { userProfileInfo }
    }
    
    const userMessages = ref([])

    const getUserMessages = (userId) => {
      const unsubscribe = messagesCollection.get().then(snapshot => {
        userMessages.value = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
      })
      // userMessages.value = userMessages.value.filter(message => message.userId === userId)
      onUnmounted(unsubscribe)
      return { userMessages }
    }

    const deleteMessage = messageId => {
        messagesCollection.doc(messageId).delete()
    }
  
    return { 
      messages, 
      sendMessage, 
      deleteMessage, 
      getUserMessages, 
      getUserInfo }
  }


