<script>
import { useRouter } from 'vue-router'
import { useAuth} from "@/firebase"


export default {
  setup() {
    const { user, isLoggedIn, signOut, signIn } = useAuth()
    const router = useRouter()

    const signUserOut = () => {
      signOut()
      router.push('/')
    }

    const signUserIn = () => {
      signIn()
      .then(() => {
        router.push('/dashboard')
      })
    }

    return { user, isLoggedIn, signUserOut, signUserIn }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="greetings">
        <h1>a i r y ui</h1>
      </div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <a to="" class="loginButton" @click="signUserIn" v-if="!isLoggedIn">Login</a>
        <!-- <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink> -->
        <RouterLink to="/dashboard" v-if="isLoggedIn">Dashboard</RouterLink>
        <button @click="signUserOut" v-if="isLoggedIn">Log out</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

.loginButton:hover {
  cursor: pointer;
}

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

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

</style>
