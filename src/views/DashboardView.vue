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
            <Message v-for="{ id, text, userName, userId, createdAt, userDisplayName } in messages" 
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
                    <button type="submit" class="sendButton">{{ sendClicked.valueOf ? 'Send' : 'Sent!'}}</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>