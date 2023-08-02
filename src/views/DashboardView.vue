<template>
    <span>dashboard</span>
    <div>
        <Message v-for="{ id, text, userName, userId } in messages" 
            :key="id" 
            :name="userName" 
            :sender="userId == user?.uid">
            {{ text }}
        </Message>
    </div>

    <div ref="loadNewMessages"></div>

    <div>
        <div>
            <form @submit.prevent="sendMessage">
                <input v-model="message" type="text" placeholder="Type a message" required />
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'
import { useChat } from '@/firebase'
import Message from '../components/Message.vue'

export default {
    setup() {
        const { messages, sendMessage } = useChat();
        const message = ref('');

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

        const send = () => {
            sendMessage(message.value)
            message.value = ''
        }


        return {
            message,
            sendMessage,
            messages,
            send
        };
    },
    components: { Message }
}

</script>