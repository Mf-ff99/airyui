<template>
    <div :class="'messageBodyWrapperRecipient'" v-if="createdAt">
        <div class="messageHeader">
            <!-- make the delete button a menu with delete and edit -->
            <div v-if="!sender">
                <span class="isNotSender" @click="toggleDisplaySenderMessageInfo">{{ senderMessageInfoClicked ? '<' : '>' }}</span>
                <router-link class="isNotSender" :to="'/profile/' + userId">{{ userDisplayName? userDisplayName : '[deleted]' }}</router-link>
            </div>
            <div v-if="sender">
                <span class="isSender" @click="toggleDisplaySenderMessageInfo">{{ senderMessageInfoClicked ? '<' : '>' }}</span>
            </div>
            <div :class="senderMessageInfoClicked ? 'messageCreatedDate' : 'messageCreateDateHidden'">
                {{ createdAt? new Date(createdAt.seconds * 1000).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '' }}
            </div> 
        </div>
        <div class="messageFooter" :id="sender ? 'senderView' : 'messageFooter'">
            <div class="message">
                <slot />
                
            </div>
            <!-- <button v-if="sender" class="deleteButton" @click="deleteUserMessage(id)">Delete</button> -->
        </div>
    </div>
    <div v-else>Loading message...</div>

</template>

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

        const deleteUserMessage = (id) => deleteMessage(id)

        const toggleDisplaySenderMessageInfo = () => {
            senderMessageInfoClicked.value = !senderMessageInfoClicked.value
        }

        return {
            user,
            deleteUserMessage,
            messageCreator,
            toggleDisplaySenderMessageInfo,
            senderMessageInfoClicked
        }
    }
}
</script>

<style scoped>

.isSender:hover, .isNotSender:hover {
    cursor: pointer;
    text-decoration: underline;
}

.messageFooter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 0.5rem;
}

.messageBodyWrapperRecipient {
    border-top: 5px black;
    border-left: 1px black;
    display: flex;
}

#senderView {
    flex-direction: row-reverse;
}

.messageHeader {
    display: flex;
    align-items: flex-start;
    /* justify-content: space-between; */
    /* width: 100%; */
    margin-bottom: 0.5rem;
}

.messageCreateDateHidden {
    display: none;
    
}



.messageHeader a {
    text-decoration: none;
    color: #333333;
}

.messageCreatedDate {
    font-size: 12px;
    padding: 2px;
}

div.messsage {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-width: 400px;
}
.messageBodyWrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    min-width: 800px;
    max-width: 100%;
    background-color: #eee;
    border-radius: 0.5rem;
    padding: 5px 5px;
    margin-right: 10px;
    border-bottom: 1px solid #333333;
}

.sender {
    margin-right: 0.5rem;
    font-size: 12px;
    padding: 2px;
}

.sender:hover {
    background-color: #333333;
    color: white;
    cursor: pointer;
    transition-duration: .4s;
    border-radius: 5px;
}

.message {
    background-color: #eee;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
    margin-right: 20px;
}

.deleteButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;
    text-decoration: none;
    color: #333333;
    font-size: 12px;
    border-radius: 2px;
    padding: 4px;
    /* width: 20px;
    height: 20px; */
    border: 1px solid #333333;
    padding-right: 2px;
    /* position: relative; */
    transition: 0.3s;
    background-color: #ffffff00;
    -webkit-transition-duration: .4s;
    margin-right: 25px;
}
.deleteButton:hover {
    background-color: #eee;
    /* color: #ffffff; */
    cursor: pointer;
}

</style>