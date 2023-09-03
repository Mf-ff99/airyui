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
            followersMessages,
            getUsersFollowers,
            getFollowersMessages
        }
    },
    components: { Message }
}
</script>

<template>
    <!-- this is very bad practice. I should not be doing this. I suck. This makes about 22 calls to firebase -->
    <!-- but alas, it is all I can get to work during a HOT RELOAD FUCK -->
    <div class="uselessWasteOfSpace">
        <!-- {{  
            getUsersFollowers(user.uid).then(followers => {
                followers.forEach(follower => {
                    getFollowersMessages(follower).then(messages => {
                        followingMessages.value = [...followingMessages.value, ...messages]
                    })
                })
            })
        }} -->
    </div>
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

<style scoped>

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

.uselessWasteOfSpace {
    display: none;
}

</style>