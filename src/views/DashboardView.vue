<!-- this application should only allow people to share twice a day -->
<!-- the entire screen is the application, with a nice, smooth, sliding-in/happy-bounce -->
<script>
import { ref, watch, nextTick } from 'vue'
import { useChat, useAuth } from '@/firebase'
import Message from '../components/Message.vue'

const { user } = useAuth()

export default {
    setup() {
        const { messages, sendMessage, getUsersFollowers, getFollowersMessages } = useChat()
        const sendClicked = ref(false)
        const disableScroll = ref(false)
        const enableFollowing = ref(false)
        const followersMessages = ref([])

        const onDisableScrollToggle = () => {
            disableScroll.value = !disableScroll.value
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
        }
    },
    components: { Message }
}

</script>

<template>
    <div class="dashboardView">
      <div class="chatHeader">
        <div class="scrollCheckboxWrapper">
          <input type="checkbox" id="nav-toggle" class="nav-toggle" @click="onDisableScrollToggle" />
          <label for="nav-toggle" class="nav-toggle-label">{{ 'disable scroll' }}</label>
        </div>
        <div class="scrollCheckboxWrapper">
          <input type="checkbox" id="toggle-following" class="nav-toggle" @click="onFollowingToggle" />
          <label for="toggle-following" class="nav-toggle-label">{{ 'show following' }}</label>
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
          <div v-if="!messages.length && enableFollowing">
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

  .signedInUserCreatedMessage {
    right: 0px !important;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .otherUserCreatedMessage {
    left: 0px !important;
    position: relative;
  }
  .messageWrapper {
    overflow-y: scroll;
    max-height: 78vh;
  }

  .submitForm {
    /* position: absolute; */
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
    /* border-top: 2px solid #415468; */
    border-top: 4px solid rgba(65,84,104, .4);
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