<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useAuth} from "@/firebase"

export default {
  setup() {
    const { user, isLoggedIn, signOut, signIn } = useAuth()
    const router = useRouter()
    const hamburgerClickedRef = ref(false)

    const hamburgerClicked = () => {
      hamburgerClickedRef.value = !hamburgerClickedRef.value
    }

    const signUserOut = () => {
      signOut()
      router.push('/')
    }

    const signUserIn = () => {
      signIn().then(() => {
        router.push('/dashboard')
      })
    }

    return { 
      user, 
      isLoggedIn, 
      signUserOut, 
      signUserIn,
      hamburgerClicked,
      hamburgerClickedRef
    }
  }
}
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="greetings">
        <h2>
          <a href="/dashboard">
            a i r y ui
          </a>
        </h2>
      </div>
      <nav>
        <div class="pcNavbar">
          <a class="loginButton" @click="signUserIn" v-if="!isLoggedIn">Login</a>
          <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink>
          <RouterLink to="/dashboard" v-if="isLoggedIn">Global</RouterLink>
          <!-- <RouterLink to="/local" v-if="isLoggedIn">Following</RouterLink> -->
          <RouterLink type="href" class="linkToProfile" :to="'/profile/' + user.uid" v-if="isLoggedIn">My Profile</RouterLink>
          <button @click="signUserOut" v-if="isLoggedIn" to="/">Log out</button>
        </div>
        <div class="mobileNavbar">
          <div class="mobileMenuView" :id="!hamburgerClickedRef ? 'hiddenMobileMenu' : 'displayedMobileMenu'">
            <a class="loginButton" @click="signUserIn" v-if="!isLoggedIn">Login</a>
            <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink> 
            <RouterLink to="/dashboard" v-if="isLoggedIn">Dashboard</RouterLink>
            <RouterLink type="href" class="linkToProfile" :to="'/profile/' + user.uid" v-if="isLoggedIn">My Profile</RouterLink>
            <a @click="signUserOut" v-if="isLoggedIn" to="/">Log out</a>
          </div>
          <div class="hamburger" @click="hamburgerClicked">{{ !hamburgerClickedRef ? '<==' : '==>'}}</div>
        </div>
      </nav>
    </div>
  </header>

  <router-view :key="$route.path"/>
</template>

<style>

a h2:hover {
  background-color: none;
}

@media screen and (max-width: 916px) {
  #app {
    margin-left: 0%;
    max-height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 5px;
    position: fixed;
    min-height: 100vh;
  }

  header {
    padding: 5px !important;
  }

  header div.wrapper {
    max-height: 50px;
  }

  form {
    bottom: 0;
    position: fixed;
  }

  .hamburger{
    width: 20px;
    height: 2px;
    background-color: white;
    border-radius: 5px;
    z-index: 10;
    transition: all .5s ease;
    cursor: pointer;
    position: relative;
  }

  #hiddenMobileMenu {
    right: -500px;
  }

  .mobileNavbar {
    transition: all .5s ease-out; 
  }

  .mobileMenuView {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 50px;
    background-color:  white;
    height: 200px;
    width: 60%;
    right: 0;
    padding-top: 50px;
    transition: all .5s ease-in-out;
    border-radius: 7px;
    border-left: solid black;
    border-top: solid black;
    border-bottom: solid black;
  }

  header {
    width: 80vw;
  }

  header div.wrapper {
    align-items: space-around;
    justify-content: space-between;
    min-width: 200px;
  }

  nav {
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 40vw;
    min-width: 100px !important;
    /* overflow-x: hidden;
    overflow-y: hidden; */
  }

  .submitForm {
    position: fixed;
    bottom: 0;
    left: 0;
  }

  
  nav a {
    font-size: 12px;
  }
  
  .pcNavbar {
    display: none;
  }
}

@media screen and (min-width: 916px) {

  #app {
    margin-right: 30%;
    margin-left: 30%;
  }

  .mobileNavbar {
    display: none !important;
  }

  .displayedMobileMenu {
    display: none;
  }

  #hiddenMobileMenu {
    display: none;
  }

}
/* color scheme for dark/light mode */
@media (prefers-color-scheme: dark) {
  #app {
    background-color: black !important;
    color: black !important;
  }

  h1 {
    color: white !important;
  }

  a {
    color: white !important;
  }

  .isNotSender, .isSender {
    color: white !important;
  }

  .profileViewContainer {
    background-color: black !important;
    color: white !important;
  }
  
  .messageWrapper div {
    color: black !important;
  }

  main {
    background-color: black !important;
    color: white !important;
  }

  .sendButton {
    background-color: #eee !important;
    color: black !important;
  }

  .sendButton:hover {
    background-color: black !important;
    color: white !important;
  }

  div.messageCreatedDate {
    color: white !important;
  }


}

#app {
  background-color: white;
  color: black;
}


::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  transition: .4s;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 0px;
}
::-webkit-scrollbar-thumb:hover {
  background: #eee;
}
::-webkit-scrollbar-thumb:active {
  background: #000000;
}
::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 50px;
}
::-webkit-scrollbar-track:hover {
  background: #666666;
}
::-webkit-scrollbar-track:active {
  background: #eee;
}
::-webkit-scrollbar-corner {
  background: transparent;
}

.loginButton:hover {
  cursor: pointer;
}

.linkToProfile:hover {
  cursor: pointer;
}


.wrapper {
  display: flex;
  flex-direction: row;
  min-width: 500px;
  max-width: 1000px;
}

.wrapper a {
  padding: 5px;
}

header {
  margin-top: 0;
  padding: 10px;
}

nav {
  padding: 5px;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

a {
  text-decoration: none;
  color: #000000;
  transition: .4s;
  border-radius: 5px;
  margin: 0 5px; 
  padding: 5px;
}

a:hover {
  color: #eee !important;
  cursor: pointer;
  background-color: #333333;
  transition: .4s;
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
