<script>
import { useRouter } from 'vue-router'
import { ref, Transition } from 'vue'
import { useAuth } from "@/firebase"
import settingsCog from '@/assets/gear.svg'

export default {
  setup() {
    const { user, isLoggedIn, signOut, signIn } = useAuth()
    const router = useRouter()
    const hamburgerClickedRef = ref(false)
    const showDropdown = ref(false)
    const settingsCogSpinner = ref(false)

    const hamburgerClicked = () => {
      hamburgerClickedRef.value = !hamburgerClickedRef.value
    }

    const activateDropdown = () => {
          settingsCogSpinner.value = !settingsCogSpinner.value
        }

    const handleDropdownClick = () => {
          showDropdown.value = !showDropdown.value
          activateDropdown()
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
      hamburgerClickedRef,
      settingsCog,
      handleDropdownClick,
      settingsCogSpinner,
      showDropdown
    }
  },
  components: {
    Transition
  },
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
        <div class="splash" v-if="!isLoggedIn">
          <a class="loginButton" @click="signUserIn" v-if="!isLoggedIn">Login</a>
          <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink>
          <!-- <RouterLink to="/dashboard" v-if="isLoggedIn">Global</RouterLink> -->
          <!-- <RouterLink to="/local" v-if="isLoggedIn">Following</RouterLink> -->
          <!-- <RouterLink type="href" class="linkToProfile" :to="'/profile/' + user.uid" v-if="isLoggedIn">My Profile</RouterLink> -->
          <!-- <button @click="signUserOut" v-if="isLoggedIn" to="/">Log out</button> -->
        </div>
        <!-- <div class="mobileNavbar">
          <div class="mobileMenuView" :id="!hamburgerClickedRef ? 'hiddenMobileMenu' : 'displayedMobileMenu'">
            <a class="loginButton" @click="signUserIn" v-if="!isLoggedIn">Login</a>
            <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink> 
            <RouterLink to="/dashboard" v-if="isLoggedIn">Dashboard</RouterLink>
            <RouterLink type="href" class="linkToProfile" :to="'/profile/' + user.uid" v-if="isLoggedIn">My Profile</RouterLink>
            <a @click="signUserOut" v-if="isLoggedIn" to="/">Log out</a>
          </div>
          <div class="hamburger" @click="hamburgerClicked">{{ !hamburgerClickedRef ? '<==' : '==>'}}</div>
        </div> -->
        <div class="dropdown">
          <button @click="handleDropdownClick()" class="dropbtn">
            <img :class="{ spin: settingsCogSpinner }" :src="settingsCog" alt="settings cog" />
          </button>
          <Transition name="bounce">
            <div class="scrollCheckboxWrapper" v-if="showDropdown">
              <div class="mobileNavOptions">
                <a class="loginButton" @click="signUserIn" v-if="!isLoggedIn">Login</a>
                <RouterLink to="/register" v-if="!isLoggedIn">Register</RouterLink> 
                <RouterLink to="/dashboard" v-if="isLoggedIn">Dashboard</RouterLink>
                <RouterLink type="href" class="linkToProfile" :to="'/profile/' + user.uid" v-if="isLoggedIn">My Profile</RouterLink>
                <button @click="signUserOut()" v-if="isLoggedIn" to="/">Log out</button>
              </div>
              <div class="chatSettings">
                <input type="checkbox" id="nav-toggle" class="nav-toggle" @click="onDisableScrollToggle" />
                <label for="nav-toggle" class="nav-toggle-label">{{ ' disable scroll' }}</label>
                <div class="scrollCheckboxWrapper">
                  <input type="checkbox" id="toggle-following" class="nav-toggle" @click="onFollowingToggle" />
                  <label for="toggle-following" class="nav-toggle-label">{{ ' show following' }}</label>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </nav>
    </div>
  </header>

  <router-view :key="$route.path"/>
</template>

<style>
/* mobile first vanilla css */
@media screen and (max-width: 800px) {

  .dropbtn {
    background-color: white;
    padding: 5px;
    font-size: 12px;
    cursor: pointer;
    border: none;
    top: 0;
  }
  
  .dropbtn img {
    width: 25px;
    height: 25px;
  }
  
  .dropdown {
    font-weight: bold;
    position: absolute;
    display: inline-block;
    transition: all 0.2s ease-in-out;
    background-color: white;
    padding: 2px 0px 0px 2px;
    background-color:  rgba(255, 255, 255, 0.8);
    top: 10px;
    right: 0px;
    min-width: 150px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
  }

  .mobileNavOptions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
  }

  .mobileNavOptions a, button {
    margin-bottom: 3px;
  }


  .mobileNav {
    position: absolute;
    right: 0;
    margin-right: 20px;
  }

  .mobileMenuView {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 30px;
    height: 100px;
    width: 30%;
    right: 0;
    margin-top: 35px;
    transition: all .5s ease-in-out;
    border-radius: 5px;
    border: 2px solid #eee;
    z-index: 1;
    padding-top: 10px;
    /* animation: bounce-in .8s; */
  }

  .mobileMenuHidden {
    right: -500px;
  }

  .dashboardView {
    /* height: 50vh; */
  }

  .bounce-enter-active {
    animation: bounce-in 0.8s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.5s reverse;
  }

  @keyframes rotate-cog {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes bounce-in {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .splash {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-width: 100px;
  }

  .splash a {
    font-size: 14px;
  }

  #app {
    max-height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    padding: 4px;
    min-height: 100vh;
    max-width: 100%;
  }

  header {
    padding: 10px !important;
    min-width: 97vw;
    overflow-x: hidden;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .wrapper .mobileNavbar {
    margin-bottom: 20px;
  }

  header div.wrapper {
    max-height: 50px;
  }

  form {
    bottom: 0;
    position: fixed;
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
    align-items: flex-end;
    flex-direction: column;
    justify-content: flex-end;
    min-width: 100px !important;
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

@media screen and (min-width: 800px) {
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
    /* background color for dark mode */
    background-color: black !important;
  }

  .message {
    color: white !important;
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
    /* color: black !important; */
  }

  main {
    /* background-color: black !important; */
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

  .dropdown {
    background-color: black;
    top: 0px;
    padding-top: 20px;
    color: white  !important;
  }

  .dropbtn {
    background-color: black;
    /* filter: invert(100%); */
  }

  .dropbtn:active {
    /* animation */
    animation: rotate-cog .8s;
    transition: all 0.2s ease-in-out;
  }

  .dropbtn img {
    background-color: white;
    filter: invert(100%);
  }
}

h2 a {
  color: #171D1C;
  text-decoration: none;
  font-style: bold;
}

/* boilerplate */
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

</style>
