<script>
import { LocalChat, useAuth } from '@/firebase.js'
import Message from '../components/Message.vue'

const { user } = useAuth()

export default {
    setup() {
        const { uid } = user.value
        const { followersMessages } = LocalChat(uid)

        return {
            followersMessages,
            user
        }
    },
    components: { Message }
}
</script>

<template>
    <div v-if="followersMessages.length">
        <Message v-for="{ id, text, userName, userId, createdAt, userDisplayName } in followersMessages" 
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
    <div v-else>
        no messages to be found :( try following someone who is active!
    </div>


</template>

<style>

</style>