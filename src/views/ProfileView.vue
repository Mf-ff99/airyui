<script>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, getUser, useChat, followUserById } from '@/firebase.js'
import Message from '../components/Message.vue'
import EditUserModal from '../components/EditUserModal.vue'

export default {
    setup() {
        const { getUsersFollowers } = useChat()
        const userMessages = ref([])
        const userId = ref('')
        const route = useRoute()
        const { user } = useAuth()
        const userProfile = ref([])
        const { messages } = useChat()

        const componentKey = ref(1)

        userId.value = route.params.id

        const followUser = userId => {
            followUserById(user.value?.uid, userId)
        }
        
        const isFollowed = getUsersFollowers(user.value?.uid).then(userFollowers => {
            return userFollowers.includes(userId.value)
        })
        
        onMounted(() => {
            getUser(userId.value)
                .then(user => {
                    userProfile.value = user

                    })
                    .catch(error => console.error(error))
            
            useChat().getUserMessages(userId.value)
                .then(messages => {
                    if (!messages.length) {
                        userMessages.value = ['user has no messages']
                        return
                    }
                    userMessages.value = messages
                    return
                })
                .catch(e => console.error(e), userMessages.value = ['nothing left to show here'])
            });

            const loadNewMessages = ref(null)
            watch(
                userMessages,
                userProfile,
                () => {
                    nextTick(() => {
                        loadNewMessages.value?.scrollIntoView({ behavior: 'smooth' })
                    })
                },
                { deep: true }
            )
    

        return {
            userId,
            user,
            userProfile,
            userMessages,
            componentKey,
            messages,
            followUser,
            isFollowed,
        }
    },
    components: { EditUserModal, Message }
}
</script>

<template>
    <span v-if="userMessages.length">{{ userMessages[0].userDisplayName }}'s profile</span>
    <div class="profileViewContainer">
        <div>
           
           <div class="userMessages" v-if="userMessages.length">
                <span v-if="userMessages[0].userId == user?.uid">{{ userMessages.length > 0 ? 'You have' : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} aired out the following:</span>
                <span v-else>{{ userMessages.length > 0 ? userMessages[0].userDisplayName : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} has aired out the following:</span>
                <div>
                    <div class="messageWrapper">         
                <Message v-for="{ id, text, userName, userId, createdAt, userDisplayName } in userMessages" 
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
                </div>
            </div>
             <div v-else>
                no messages to be found :( try sending something!
            </div> 
            <div ref="loadNewMessages"></div>
        </div>
        <div>
            <div class="userProfile">
                <div class="userProfileHeader">
                    <div class="profileStatus">
                        <p>Status</p>
                        <span>{{ userProfile?.length ? userProfile[0].userProfileStatus : ''}}</span>
                    </div>
                    <img class="profileImage" :src="`${userProfile[0]?.userAvatar}`" />
                </div>
                <div class="userNameWrapper">
                    <p>Username</p>
                    <span>{{ userProfile[0]?.userDisplayName }}</span>
                </div>
                <div>
                    <span>{{ user?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleString() : '' }}</span>
                </div>
                <div v-if="user?.uid == userId" class="modal">
                    <EditUserModal :userId="user.uid"/>
                </div>
                <div v-if="user?.uid != userId">
                    <div v-if="isFollowed">
                        <button @click="followUser(userId)">Unfollow</button>
                    </div>
                    <div v-if="!isFollowed">
                        <button @click="followUser(userId)">Follow</button>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
</template>


<style scoped>
/* mobile first css */
@media screen and (max-width: 800px) {

}

@media screen and (min-width: 800px) {

}


</style>