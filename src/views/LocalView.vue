<script>
import { FollowingChat, useAuth } from '@/firebase.js'
import Message from '../components/Message.vue'
import { onMounted, ref } from 'vue'

const { user, isLoggedIn } = useAuth()

export default {
    setup() {
        const followingMessages = ref([])

        onMounted(() => {
            if(isLoggedIn.value) {
                const { followersMessages } = FollowingChat()
                followingMessages.value = followersMessages
                console.log(user.value)
            }
        })

        return {
            followingMessages,
            user
        }
    },
    components: { Message }
}
</script>

<template>
    <div v-if="followingMessages.length">
        <Message v-for="{ id, text, userName, userId, createdAt, userDisplayName } in followingMessages" 
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