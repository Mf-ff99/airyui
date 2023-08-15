<script>
import { ref, onMounted, watch, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, getUser, getUserMesssages, useChat } from '@/firebase.js'
import Message from '../components/Message.vue'
import EditUserModal from '../components/EditUserModal.vue'

export default {
    
    setup() {
        const userMessages = ref([])
        const userId = ref('')
        const route = useRoute()
        const { user } = useAuth()
        const userProfile = ref([])
        const { deleteMessage } = useChat()

        const componentKey = ref(1)

        userId.value = route.params.id

        const deleteUserMessage = (id) => {
            deleteMessage(id)
            getUserMesssages(userId.value)
            .then(messages => {
                if (!messages.length) {
                    userMessages.value = ['user has no messages']
                    return
                }
                userMessages.value = messages
                return
                })
                .catch(e => console.error(e), userMessages.value = ['nothing left to show here'])
        }

        console.log(userId)
        
        onMounted(() => {
            getUser(userId.value)
                .then(user => {
                    userProfile.value = user
                    })
                    .catch(error => console.error(error))
            
            getUserMesssages(userId.value)
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
                () => {
                    nextTick(() => {
                        loadNewMessages.value?.scrollIntoView({ behavior: 'smooth' })
                    })
                },
                { deep: true }
            )
    

        return {
            userId,
            Message,
            user,
            userProfile,
            userMessages,
            componentKey,
            deleteUserMessage,
        }
    },
    components: { EditUserModal }
}
</script>

<template>
    <span>profile view</span>
    <div class="profileViewContainer">
        <div>
           
           <div class="userMessages" v-if="userMessages.length >= 1">
                <span v-if="userMessages[0].userId == user?.uid">{{ userMessages.length > 0 ? 'You have' : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} aired out the following:</span>
                <span v-else>{{ userMessages.length > 0 ? userMessages[0].userDisplayName : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} has aired out the following:</span>
                <!-- For the life of me I cannot get props to be passed appropriately to the Message component, so here is a messy workaround that I'm not stoked on -->
                <!-- turns out, I am an idiot. When importing a component/template, you must also EXPORT IT within the script, THIS ISN'T REACT FML -->
                <div>
                    <div class="messageWrapper">
                        <div v-for="{ id, text, userName, userId, createdAt, userDisplayName } in userMessages" :key="id">
                            <div class="messageHeader">
                                <div>
                                    {{ userDisplayName? userDisplayName : '[deleted]' }}
                                </div>
                                <div>
                                    {{ createdAt? new Date(createdAt.seconds * 1000).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) : '' }}
                                </div>
                            </div>
                            <div class="messageFooter">
                                {{ text }}
                                <div v-if="userId == user?.uid">
                                    <button class="deleteMessageButton" @click="deleteUserMessage(id)">Delete</button>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             <div v-else>
                no messages to be found :( try sending something!
            </div> 
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
                <div v-else>
                    <button>Follow</button>
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
}

@media screen and (min-width: 800px) {
    
    .profileViewContainer {
        display: flex;
        flex-direction: row;
    }
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
    margin: 5px;
    background-color: #eee;
    border-radius: 5px;
    padding: 2px;
    min-width: fit-content;
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