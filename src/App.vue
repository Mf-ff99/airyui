<script>
import { useRouter } from 'vue-router'
import { useAuth} from "@/firebase"

// add logic here to redirect after login/logout

export default {
  setup() {
    const { user, isLoggedIn, signOut, signIn } = useAuth()
    return { user, isLoggedIn, signOut, signIn }
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
        <RouterLink to="/login" @click="signIn" v-if="!isLoggedIn">Login</RouterLink>
        <!-- <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink> -->
        <RouterLink to="/dashboard" v-if="isLoggedIn">Dashboard</RouterLink>
        <button @click="signOut" v-if="isLoggedIn">Log out</button>
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
