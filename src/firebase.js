import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import { ref, onUnmounted, onMounted, computed } from 'vue'

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

// firestore utility hooks
const firestore = firebase.firestore()
const messagesCollection = firestore.collection('messages')
const messagesQuery = messagesCollection.orderBy('createdAt', 'desc').limit(100)
const usersCollection = firestore.collection('users')
const { user, isLoggedIn } = useAuth()

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
        console.log('SINGED IN')
      }
    }
    
  const signOut = () => {
    auth.signOut()
  }

    return { user, isLoggedIn, signIn, signOut }
}

export function useChat() {
    const messages = ref([])
    const sender = ref([])
    const userMessages = ref([])
    const followersMessages = ref([])
    
    const unsubscribe = messagesQuery.onSnapshot(snapshot => {
      messages.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .reverse()
    })
    onUnmounted(unsubscribe)
    
    const sendMessage = async text => {
      sender.value = await getUser(user.value.uid)
      const userDisplayName = sender.value[0].userDisplayName
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

    const getUsersFollowers = async (userId) => {
      const snapshot = await usersCollection.where('userId', '==', userId).get()
      const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
      const userFollowers = user[0].following
      console.log(userFollowers, 'userFollowers')
      return userFollowers
    }

    const getFollowersMessages = async userFollower => {
      const snapshot = await messagesCollection.where('userId', '==', userFollower).orderBy('createdAt', 'desc').limit(1000).get()
      followersMessages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
      console.log(followersMessages, 'FUCK')
      return followersMessages.value ? followersMessages.value : null
    }

    const deleteMessage = messageId => {
        messagesCollection.doc(messageId).delete()
    }

    const getUserMessages = async userId => {
      const snapshot = await messagesCollection.where('userId', '==', userId).orderBy('createdAt', 'desc').limit(1000).get()
      userMessages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
      return userMessages.value ? userMessages.value : null
    }

  
    return { 
      messages, 
      sendMessage, 
      deleteMessage,
      getUserMessages,
      getUsersFollowers,
      getFollowersMessages
    }
  }
  
export function FollowingChat() {
  console.log(user, 'user.value')
  const followersMessages = ref(["fuck"])
  const id = ref("")

  id.value = user.value.uid
  console.log(id.value, 'id.value')

  const getUsersFollowers = async (userId) => {
    const snapshot = await usersCollection.where('userId', '==', userId).get()
    const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
    const userFollowers = user[0].following
    console.log(userFollowers, 'userFollowers')
    return userFollowers
  }

  const getFollowersMessages = async userFollower => {
    const snapshot = await messagesCollection.where('userId', '==', userFollower).orderBy('createdAt', 'desc').limit(1000).get()
    followersMessages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
    console.log(followersMessages, 'FUCK')
    return followersMessages.value ? followersMessages.value : null
  }

  getUsersFollowers(id.value).then(userFollowers => {
    userFollowers.forEach(userFollower => {      
      getFollowersMessages(userFollower).then(followersMessages => {
        console.log(followersMessages, 'followersMessages in fb')
      })
    })
  })

  return {
    followersMessages,
  }
}

export const getUser = async id => {
  const snapshot = await usersCollection.where('userId', '==', id).get()
  const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
  return user.length > 0 ? user : null
}

export const editUserData = async (userId, newUserDisplayName, newUserStatus) => {
  // update user collection with newUserDisplayName and newUserStatus
  if (newUserDisplayName) {
    const snapshot = await usersCollection.where('userId', '==', userId).get()
    const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
    const userDocId = user[0].id
    await usersCollection.doc(userDocId).update({
      userDisplayName: newUserDisplayName,
    })
  }

  if (newUserStatus) {
    const snapshot = await usersCollection.where('userId', '==', userId).get()
    const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
    const userDocId = user[0].id
    await usersCollection.doc(userDocId).update({
      userProfileStatus: newUserStatus
    })
  }
}

export const followUserById = async (userId, userToFollowId) => {
  // follow user with a userId by adding userToFollowId to the following array
  const snapshot = await usersCollection.where('userId', '==', userId).get()
  const user = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}))
  const userDocId = user[0].id
  await usersCollection.doc(userDocId).update({
    following: firebase.firestore.FieldValue.arrayUnion(userToFollowId)
  })
}


