<script>
import { FollowingChat, useAuth } from '@/firebase.js'
import Message from '../components/Message.vue'
import { onMounted, ref } from 'vue'

const { user, isLoggedIn } = useAuth()

export default {
    setup() {
        const followingMessages = ref([])
        const { followersMessages } = FollowingChat(user.value ? user.value.uid : null)
        followingMessages.value = followersMessages.value

        console.log(followersMessages.value, 'fwiw this fucking SUCKS ASS')           
        followingMessages.value = followersMessages

        return {
            followingMessages,
            user,
            followersMessages
        }
    },
    components: { Message }
}
</script>

<template>
    <div class="messageWrapper">
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
</div>

</template>

<style>

</style>