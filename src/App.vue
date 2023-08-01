<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Main from './components/Main.vue'
import { onMounted, ref} from "vue"
const router = useRouter()

const isLoggedIn = ref(false)
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"

// auth current state logic 
let auth;
onMounted(() => {
  auth = getAuth()
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
    } else {
      isLoggedIn.value = false
    }
  })
})

const handleLogout = () => {
  signOut(auth)

}
</script>

<template>
  <header>
    <div class="wrapper">
      <Main msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/dashboard" v-if="isLoggedIn">Dashboard</RouterLink>
        <button @click="handleLogout" v-if="isLoggedIn">Log out</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

nav {
  padding: 5px;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.wrapper {
  display: flex;
  flex-direction: row;
  min-width: 500px;
}
.wrapper a {
  padding: 5px;
}

header {
  margin-top: 0;
  padding: 10px;
}

nav button {
  padding: 5px;
  border: none;
  color: black;
  border-radius: 5px;
  background-color: white;
}

nav button:hover {
  cursor: pointer;
}

</style>
