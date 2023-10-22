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
    <div>
            <div class="userProfile">
                <div v-if="user?.uid == userId" class="modal">
                    <EditUserModal :userId="user.uid"/>
                </div>
                <div class="userProfileHeader">
                    <div class="userNameWrapper">
                        <span>@{{ userProfile[0]?.userDisplayName }}</span>
                    </div>
                    <img class="profileImage" :src="`${userProfile[0]?.userAvatar}`" />    
                </div>
                <div>
                    <span class="userStatus">{{ userProfile?.length ? userProfile[0].userProfileStatus : ''}}</span>
                </div>
                <div>
                    <span>{{ user.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleString() : '' }}</span>
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
    <div class="profileViewContainer">
        <div>
           <div class="userMessages" v-if="userMessages.length">
                <!-- <span v-if="userMessages[0].userId == user?.uid">{{ userMessages.length > 0 ? 'You have' : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} aired out the following:</span>
                <span v-else>{{ userMessages.length > 0 ? userMessages[0].userDisplayName : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} has aired out the following:</span> -->
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
        
        </div>
    </div>
</template>


<style scoped>
/* mobile first css */
@media screen and (max-width: 800px) {

    .messageBodyWrapperRecipient {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(160, 120, 253, 0.452);
        animation: slide-up 0.3s ease;
        max-width: 100vw;
        padding-right: 5px;
    }

    .userProfile {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        border-bottom: 1px solid rgba(160, 120, 253, 0.452);
    }

    .userProfileHeader {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: flex-start;
        width: 100%;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.452);
    }

    span.userStatus {
        margin-left: 25px;
    }
    .userProfileHeader:first-child {
        padding: 5px;
    }

    .userProfile img {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        margin-right: 5px;
    }

    .profileViewContainer {
        margin-top: 10px;
    }

}

@media screen and (min-width: 800px) {

}


</style>