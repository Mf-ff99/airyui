<script>
import { FollowingChat, useAuth } from '@/firebase.js'
import Message from '../components/Message.vue'
import { onMounted, ref } from 'vue'

const { user } = useAuth()

export default {
    setup() {
        const followingMessages = ref([])
        const { followersMessages, getUsersFollowers, getFollowersMessages } = FollowingChat(user.value ? user.value.uid : null)
        
        onMounted(() => {
            // console.log(user.value.uid)
            if(!user.value) return
            getUsersFollowers(user.value.uid).then(followers => {
                followers.forEach(follower => {
                    getFollowersMessages(follower).then(messages => {
                        followingMessages.value = [...followingMessages.value, ...messages]
                    })
                })
            })
        })
        
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
    {{ user ? user : 'noooo user here' }}
    <div class="messageWrapper">
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
</div>

</template>

<style>

</style>