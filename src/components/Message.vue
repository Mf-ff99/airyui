<script>
import { useAuth, useChat } from '@/firebase'
import { ref } from 'vue'

export default {
    props: {
        name: {
            type: String,
            required: true,
            default: ''
        },
        id: {
            type: String,
            required: true,
            default: ''
        },
        sender: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Object,
            required: true,        
        },
        userId: {
            type: String,
            required: true,
            default: ''
        },
        userDisplayName: {
            type: String,
            required: true,
            default: ''
        },
    },
    setup() {
        const { user } = useAuth()
        const { deleteMessage } = useChat()
        const messageCreator = ref([])
        const senderMessageInfoClicked = ref(false)
        const messageDeletedRef = ref(false)

        const deleteUserMessage = (id) => {
            deleteMessage(id)
            messageDeletedRef.value = true
        }
        
        const toggleDisplaySenderMessageInfo = () => {
            senderMessageInfoClicked.value = !senderMessageInfoClicked.value
        }

        return {
            user,
            messageDeletedRef,
            deleteUserMessage,
            messageCreator,
            toggleDisplaySenderMessageInfo,
            senderMessageInfoClicked
        }
    }
}
</script>

<template>
    <div :class="'messageBodyWrapperRecipient'" v-if="createdAt" :id="[messageDeletedRef ? 'inActive' : '']">
        <div class="messageHeader">
            <div>
                <!-- <span class="isNotSender" @click="toggleDisplaySenderMessageInfo">{{ senderMessageInfoClicked ? '<' : '>' }}</span> -->
                <router-link class="" :to="'/profile/' + userId">@{{ userDisplayName? userDisplayName : 'anon' }}</router-link>
            </div>
            <div :class="senderMessageInfoClicked ? 'messageCreatedDate' : 'messageCreateDateHidden'">
                <button v-if="user?.uid == userId" class="deleteButton" @click="deleteUserMessage(id)">Delete</button>
                {{ createdAt? new Date(createdAt.seconds * 1000).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '' }}
            </div> 
        </div>
        <div class="messageFooter" :id="sender ? 'senderView' : 'messageFooter'">
            <div class="message">
                <slot />
                
            </div>
        </div>
    </div>
    <div v-else class="loadingMessage"></div>

</template>

<style scoped>
/* mobile first css */
@media screen and (max-width: 800px) {
    .messageWrapper {
        /* overflow-x: scroll; */
    }

    .messageCreateDateHidden {
        display: none;
    }

    .loadingMessage {

  }

  a {
    font-size: 12px;
  }
}

@media screen and (min-width: 800px) {
    a {
        font-size: 15px;
    }
}

/* mobile and desktop styles */

a {
    text-decoration: none;
    color: #000;
}

a:hover {
    cursor: pointer;
    text-decoration: underline;
    transition: .5s ease-in-out;
}

</style>