<template>
    <span>profile view</span>
    <div class="userMessages" v-if="userMessages.length">
        <span>{{ userMessages.length > 0 ? userMessages[0].userName : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} has aired out the following:</span>
        <!-- For the life of me I cannot get props to be passed appropriately to the Message component, so here is a messy workaround -->
        <div>
            <div class="messageWrapper">
                <div v-for="{ id, text, userName, userId, createdAt } in userMessages" :key="id">
                    <div class="messageHeader">
                        <div>
                            {{ userName }}
                        </div>
                        <div>
                            {{ createdAt? new Date(createdAt.seconds * 1000).toLocaleString() : '' }}
                        </div>
                        <div v-if="userId == user?.uid">
                            <button @click="deleteUserMessage(id)">Delete</button>
                        </div>  
                    </div>
                    <div>
                        {{ text }}
                    </div>
                </div>
            </div>
        </div>

        </div>  
        <div v-else>Loading profile...</div>
</template>

<script>
import { ref, onMounted, watch, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, getUser, getUserMesssages, useChat } from '@/firebase.js'
import Message from '../components/Message.vue'

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
                .catch(error => console.error(error))
        } 
        
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
                .catch(error => console.error(error))
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
            deleteUserMessage

        }
    }
}
</script>

<style scoped>

.messageWrapper div {
    margin: 5px;
    background-color: #eee;
    border-radius: 5px;
    padding: 2px;
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