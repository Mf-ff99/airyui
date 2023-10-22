<!-- this application should only allow people to share twice a day -->
<!-- the entire screen is the application, with a nice, smooth, sliding-in/happy-bounce -->
<script>
import { ref, watch, nextTick, Transition } from 'vue'
import { useChat, useAuth } from '@/firebase'
import Message from '../components/Message.vue'
import settingsCog from '@/assets/gear.svg'

const { user } = useAuth()

export default {
    setup() {
        const { messages, sendMessage, getUsersFollowers, getFollowersMessages } = useChat()
        const sendClicked = ref(false)
        const disableScroll = ref(false)
        const enableFollowing = ref(false)
        const followersMessages = ref([])
        const showDropdown = ref(false)
        const settingsCogSpinner = ref(false)

        const onDisableScrollToggle = () => {
            disableScroll.value = !disableScroll.value
        }

        const spinSettingsCog = () => {
          settingsCogSpinner.value = !settingsCogSpinner.value
        }

        const handleDropdownClick = () => {
          showDropdown.value = !showDropdown.value
          spinSettingsCog()
        }

        const onFollowingToggle = () => {
            enableFollowing.value = !enableFollowing.value
            if (enableFollowing.value) {
              getUsersFollowers(user.value.uid).then(userFollowers => {
                userFollowers.forEach(userFollower => {      
                  getFollowersMessages(userFollower).then(followerMessages => {
                    followersMessages.value.push(followerMessages)
                  })
                })
              })
            }
        }
        
        // logic for scrolling to page bottom when there are messages
        const loadNewMessages = ref(disableScroll.value)
        watch(
            messages,
            () => {
                nextTick(() => {
                  if (disableScroll.value) return
                    loadNewMessages?.value?.scrollIntoView({ behavior: 'smooth' })
                })
            },
            { deep: true }
            )
  
        const message = ref('')
        const send = () => {
            sendClicked.value = true
            sendMessage(message.value)
            message.value = ''
        }

        return {
            message,
            sendMessage,
            messages,
            send,
            user,
            sendClicked,
            loadNewMessages,
            onDisableScrollToggle,
            disableScroll,
            enableFollowing,
            onFollowingToggle,
            followersMessages,
            handleDropdownClick,
            showDropdown,
            settingsCog,
            spinSettingsCog,
            settingsCogSpinner,
          }
    },
    components: { Message, Transition }
}

</script>

<template>
    <div class="dashboardView">
      <div class="chatHeader">
        <div class="dropdown">
          <button @click="handleDropdownClick()" class="dropbtn">
            <img :class="{ spin: settingsCogSpinner }" :src="settingsCog" alt="settings cog" />
          </button>
          <Transition name="bounce">
            <div class="scrollCheckboxWrapper" v-if="showDropdown">
              <div>
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
      </div>
        <div class="messageWrapper">
          <div class="messagesExistContainer" v-if="messages.length && !enableFollowing">
            <Message :class="[userId == user.uid ? 'signedInUserCreatedMessage' : 'otherUserCreatedMessage']" v-for="{ id, text, userName, userId, createdAt, userDisplayName } in messages" 
                :key="id"
                :id="id"
                :userId="userId" 
                :name="userName" 
                :sender="userId == user?.uid"
                :createdAt="createdAt"
                :userDisplayName="userDisplayName"
                >
                {{ text }}
            </Message>
          </div>
          <div v-if="!messages.length && enableFollowing" class="loadingFill">
            Loading messages...
          </div>
          <div class="messagesExistContainer" v-if="followersMessages.length && enableFollowing">
            <Message v-for="{ id, text, userName, userId, createdAt, userDisplayName } in followersMessages.flat()" 
                :key="id"
                :id="id"
                :userId="userId" 
                :name="userName" 
                :sender="userId == user?.uid"
                :createdAt="createdAt"
                :userDisplayName="userDisplayName"
                >
                {{ text }}
            </Message>
          </div>
          <div ref="loadNewMessages"></div>
        </div>

        <div>
            <div class="submitForm">
                <form @submit.prevent="send">
                    <textarea v-model="message" type="text" placeholder="Type a message" @keyup.enter="send" required />
                    <button type="submit" class="submit-button"><span>{{ sendClicked.valueOf ? 'Send' : 'Sent!'}}</span></button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* mobile first css */
@media screen and (max-width: 800px) {

  .dashboardView {
    /* height: 50vh; */
  }

  .bounce-enter-active {
    animation: bounce-in 0.5s;
  }
  .bounce-leave-active {
    animation: bounce-in 0.5s reverse;
  }

  .spin {
 animation: spin 10s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
 }
  100% {
    transform: rotate(360deg);
 }
}

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.18);
    }
    100% {
      transform: scale(1);
    }
  }

  .dropbtn {
    background-color: white;
    padding: 5px;
    font-size: 12px;
    cursor: pointer;
    border: none;
  }
  
  .dropbtn img {
    width: 25px;
    height: 25px;
  }
  
  .dropdown {
    font-weight: bold;
    position: absolute;
    display: inline-block;
    transition: all 0.2s ease;
    background-color: white;
    padding: 2px 0px 0px 2px;
  }

  /* .dropdown::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: none;
    animation: trace-border 3s infinite;
 } */

 @keyframes trace-border {
  /* trace the border from top-left to top-right, then from top-right to bottom right, then from bottom right to bottom left, then from bottom left to top left */
 }
  .messageWrapper {
    border-top: 1px solid rgba(65,84,104, .1);
    box-shadow: #415468;
  }

  .messageBodyWrapperRecipient {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    animation: slide-up 0.3s ease;
  }

  .signedInUserCreatedMessage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(160, 120, 253, 0.452);
    animation: slide-up 0.3s ease;
    margin-left: 70px;
    max-width: 100vw;
    padding-right: 5px;
  }

  .signedInUserCreatedMessage.new {
  animation: fadeIn 0.1s ease-in-out;
  }

  .otherUserCreatedMessage {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(97, 121, 255, 0.18);
    animation: slide-up 0.1s ease;
    margin-left: -70px;
    max-width: 100vw;
    padding-left: 70px;
  }

  .otherUserCreatedMessage.new {
    /* animation: fadeIn 0.5s ease-in-out; */
  }

  @keyframes slide-up {
  0% {
    transform: translateY(100%);
    opacity: 1;
 }
  100% {
    transform: translateY(0);
    opacity: 1;
 }
}
  .messageWrapper {
    overflow-y: scroll;
    max-height: 83vh;
  }

  .submitForm {
    bottom: 0;
    margin-left: 0;
    width: 100%;
    background-color: #fff;
    padding: .1rem;
    height: 10vh;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    font-size: 1.5rem;
    max-height: 10vh;
    border-top: 4px solid rgba(65,84,104, .1);
    border-radius: 10px;
  }

  .submitForm form textarea {
    left: 0;
    bottom: 0;
    width: 70vw;
    height: 9vh;
    border: none;
    resize: none; 
  }

  .submitForm form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

@media screen and (min-width: 800px) {

}

/* styles applied to both mobile and desktop */
.submit-button {
            width: 100px;
            height: 50px;
            background-color: #415468;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
        }

        /* Loading animation using keyframes */
        @keyframes slide {
            0% {
                width: 100px;
            }
            100% {
                width: 40px;
            }
        }
        /* Style for the loading state */
        .loading {
            background-color: #ccc;
            animation: slide 1s linear infinite;
        }

</style>