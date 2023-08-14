import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { ref, onUnmounted, computed } from 'vue'

firebase.initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
            userProfileStatus: 'hey, im the default status! look at me, im a noob!! i don\'t know how to change my default status!',
            messagesSent: 0,
            userRole: 'user',
            userAvatar: 'https://picsum.photos/200',
            userDisplayName: 'anon',
            following: [],
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
    const { user, isLoggedIn } = useAuth()
    const sender = ref([])
    
    
    const unsubscribe = messagesQuery.onSnapshot(snapshot => {
      messages.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .reverse()
    })
    onUnmounted(unsubscribe)
    
    const sendMessage = text => {
      sender.value  = getUser(user.value.uid)
      const { userDisplayName } = sender.value
      if (!isLoggedIn.value) return
      const { uid, displayName } = user.value
      messagesCollection.add({
        userName: displayName,
        userId: uid,
        text: text,
        userDisplayName: userDisplayName? userDisplayName : 'anon',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    }

    const deleteMessage = messageId => {
        messagesCollection.doc(messageId).delete()
    }
  
    return { 
      messages, 
      sendMessage, 
      deleteMessage
    }
  }

export const getUser = async id => {
  const snapshot = await usersCollection.where('userId', '==', id).get()
  const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
  return user.length > 0 ? user : null
}

export const getUserMesssages = async userId => {
  const snapshot = await messagesCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').limit(1000).get()
  const userMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
  return userMessages.length > 0 ? userMessages : null
}

export const editUserData = async (userId, newUserDisplayName, newUserStatus) => {
  // update user collection with newUserDisplayName and newUserStatus
  console.log(userId, newUserDisplayName, newUserStatus)
  const snapshot = await usersCollection.where('userId', '==', userId).get()
  const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
  const userDocId = user[0].id
  await usersCollection.doc(userDocId).update({
    userDisplayName: newUserDisplayName,
    userProfileStatus: newUserStatus
  })
}


