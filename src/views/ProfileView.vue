<script>
import { ref, onMounted, watch, nextTick } from 'vue'
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
           
           <div class="userMessages" v-if="userMessages.length >= 1">
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
                <div v-if="user?.uid == userId">
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


@media screen and (max-width: 800px) {
    .profileViewContainer {
        display: flex;
        flex-direction: column;
    }

    .userMessages {
        max-height: 500px;
        overflow-y: scroll;
        overflow-x: hidden;
        max-width: 95vw;
    }

    .messageWrapper {
        padding-top: 150px;
    }

}

@media screen and (min-width: 800px) {
    
    .profileViewContainer {
        display: flex;
        flex-direction: row;
    }
}

.profileStatus {
    padding: 5px;
    width: 200px;
    word-wrap: normal;
}

.userNameWrapper {
    padding: 5px;
    width: 200px;
    word-wrap: normal;
}

.userProfileHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.profileImage {
    width: 55px;
    height: 55px;
    border-radius: 50%;
}

.deleteMessageButton {
    cursor: pointer;
}

.messageWrapper div {
    /* margin: 5px;
    background-color: #eee;
    border-radius: 5px;
    padding: 2px;
    min-width: fit-content; */
}

.messageWrapper {
    overflow-x: hidden;
    overflow-y: scroll;
    max-height: 800px;
    min-width: 500px;
}
.userMessages {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 10px;
    height: 100%;
    border-bottom: 1px solid #eee;
    box-shadow: outset 0px 0px 5px 0px rgba(0,0,0,0.75);
}

.userProfileMessages {
    padding: 5px;
    margin: 5px;
    background-color: #eee;
}

.messageHeader {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
}

</style>