<template>
    <div class="dashboardView">
      <div class="chatHeader">
        <ul class="chatRoomSelector">
          <li>
            <span>general</span>
          </li>
          <li>
            <span>following</span>
          </li>
        </ul>
        <div class="scrollCheckboxWrapper">
          <input type="checkbox" id="nav-toggle" class="nav-toggle" @click="onDisableScrollToggle" />
          <label for="nav-toggle" class="nav-toggle-label">{{ disableScroll.value ? 'enable scroll' : 'disable scroll'  }}</label>
        </div>
      </div>
        <div class="messageWrapper">
          <div class="messagesExistContainer" v-if="messages.length">
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
          <div v-else>Loading messages...</div>
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

<script>
import { ref, watch, nextTick } from 'vue'
import { useChat, useAuth } from '@/firebase'
import Message from '../components/Message.vue'

const { user } = useAuth()

export default {
    setup() {
        const { messages, sendMessage } = useChat()
        const sendClicked = ref(false)
        const disableScroll = ref(false)

        const onDisableScrollToggle = () => {
            disableScroll.value = !disableScroll.value
        }
        
        // logic for scrolling to bottom when there are messages
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
            disableScroll
        }
    },
    components: { Message }
}

</script>

<style>

@media screen and (max-width: 916px) {
  .messageWrapper {
    /* max-width: 80vw; */
    max-height: 70vh;
    background-color: white !important;
  }

  form textarea {
    width: 200px !important;
    min-width: 100px !important;
    max-height: 100px !important;
    min-height: 60px !important;
    margin-top: 10px;
  }
  #app {
    overflow-y: auto;
    overflow-x: auto;
    min-width: 100%;
  }

   form button.sendButton {
    /* hide button */
    display: none;
  }

  .chatHeader {
    /* max-width: 80vw; */
    margin-left: 0 auto;
  }

  .dashboardView {
    /* max-width: 80vw; */
    margin-left: 0 auto;
  }

  .submitForm {
    padding-top: 5px;
  }

}

ul.chatRoomSelector li {
  list-style: none;
  cursor: pointer;
  padding: 5px;
  margin-left: 5px;
  border-radius: 5px;
  /* border: red 1px; */
  transition: .4s ease-in-out;
}

ul.chatRoomSelector li:hover {
  background-color: #a4a7ac;
  color: #333333;
}

ul.chatRoomSelector {
  display: flex;
  flex-direction: row;
  align-items: space-between;
  justify-content: space-between;
}

.chatHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #333333;
    color: #a4a7ac;
    font-size: 16px;
    font-weight: 600;
    border-radius: 5px;
    margin-bottom: 10px;
}

.scrollCheckboxWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.scrollCheckboxWrapper label {
  margin: 2px;
  cursor: pointer;
}

.scrollCheckboxWrapper input {
  margin: 5px;
  cursor: pointer;
}

form {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

textarea {
    width: 80%;
    height: 30px;
    border-radius: 5px;
    border-width: 1px;
    max-width: 300px;
    max-height: 70px;
    min-width: 300px;
    min-height: 70px;
    margin-right: 30px;
}
.sendButton {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    text-decoration: none;
    color: #333333;
    font-size: 18px;
    border-radius: 5px;
    width: 100px;
    height: 40px;
    border: 1px solid #333333;
    position: relative;
    transition: 0.3s;
    background-color: #ffffff00;
    -webkit-transition-duration: .4s;
    margin-right: 25px;
}

.sendButton::before, .sendButton::after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  right: 15px;
  transform-origin: 100% 50%;
  height: 1px;
  width: 11px;
  background-color: #333;
  border-radius: 2px;
  will-change: transform;
  transition: .3s;
}

.sendButton::before {
  transform: translateY(-50%) rotate(30deg);
}

.sendButton::after {
  transform: translateY(-50%) rotate(-30deg);
}

.sendButton:hover::before {
  transform: translate(5px, -50%) rotate(30deg);
  color: white;
}

.sendButton:hover::after {
  transform: translate(5px, -50%) rotate(-30deg);
  color: white;
}

.sendButton:hover {
    background-color: #333333;
    color: #ffffff;
    cursor: pointer;
}


.messageWrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 800px;
    overflow-y: scroll;
    overflow-x: hidden;
    /* max-width: 100vw; */
}
</style>