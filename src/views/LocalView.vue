<script>
import { FollowingChat, useAuth } from '@/firebase.js'
import Message from '../components/Message.vue'
import { onMounted, ref } from 'vue'

const { user } = useAuth()

export default {
    setup() {
        const { followersMessages } = FollowingChat()
        const followingMessages = ref([])
        
        console.log(followersMessages, 'followersMessages')
        followingMessages.value = followersMessages
        
        onMounted(() => {
            // console.log(user.value.uid)
            if(!user.value) return
        })

        console.log(followingMessages)
        
        return {
            followingMessages,
            user,
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
    <!-- <div v-else>
        no messages to be found :( try following someone who is active!
    </div> -->
    <div v-else>
        this feature is broken, because mf-ff99 is lacking a critical understanding of Vue's reactivity
    </div>
</div>

</template>

<style scoped>

</style>