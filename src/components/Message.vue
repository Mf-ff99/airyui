<template>
    <div class="messageBodyWrapper" v-if="createdAt">
        <div class="messageHeader">
            <!-- make the delete button a menu with delete and edit -->
            <router-link v-if="!sender" class="sender" :to="'/profile/' + userId">{{ userDisplayName? userDisplayName : '[deleted]' }}</router-link>
            <router-link v-if="sender" class="sender" :to="'/profile/' + userId">hey, i sent this one</router-link>
            <div class="messageCreatedDate">
                {{ createdAt? new Date(createdAt.seconds * 1000).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '' }}
            </div>
            <button v-if="sender" class="deleteButton" @click="deleteUserMessage(id)">Delete</button>
        </div>
        <div>
            <div class="message">
                <slot />
                
            </div>
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

        const deleteUserMessage = (id) => deleteMessage(id)

        return {
            user,
            deleteUserMessage,
            messageCreator,
            // messageCreatorData,
            // userReadableDate,
        }
    }
}
</script>

<style scoped>

.messageHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
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
    min-width: 400px;
    background-color: #eee;
    border-radius: 0.5rem;
    padding: 5px 5px;
    margin-right: 
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