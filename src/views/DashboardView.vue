<template>
    <span>dashboard</span>
    <div class="messageWrapper">
        <Message v-for="{ id, text, userName, userId } in messages" 
            :key="id"
            :id="id" 
            :name="userName" 
            :sender="userId == user?.uid">
            {{ text }}
        </Message>
    </div>

    <div ref="loadNewMessages"></div>

    <div>
        <div>
            <form @submit.prevent="send">
                <input v-model="message" type="text" placeholder="Type a message" required />
                <button type="submit">Send</button>
            </form>
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
        const { messages, sendMessage, deleteMessage } = useChat()
        
        const loadNewMessages = ref(null)
        watch(
            messages,
            () => {
                nextTick(() => {
                    loadNewMessages.value?.scrollIntoView({ behavior: 'smooth' })
                })
            },
            { deep: true }
            )
            
        const message = ref('')
        const send = () => {
            sendMessage(message.value)
            message.value = ''
        }

        return {
            message,
            sendMessage,
            messages,
            send,
            user
        }
    },
    components: { Message }
}

</script>

<style>
.messageWrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 800px;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>