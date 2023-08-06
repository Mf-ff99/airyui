<template>
    <span>profile view</span>
    <div class="userMessages" v-if="userMessages.length">
        <span>{{ userMessages.length > 0 ? userMessages[0].userName : 'ERROR, DON\'T LOOK NOW, THERE\'S AN ERROR' }} has aired out the following:</span>
        <!-- <Message v-for="{ id, text, userName, userId, createdAt } in userMessages" 
            :key="id"
            :id="id" 
            :name="userName" 
            :sender="userId == user?.uid"
            :createdAt="createdAt"
            >
            {{ text }}
        </Message> -->
        <div>
            <div class="messageWrapper">
                <div v-for="{ id, text, userName, userId, createdAt } in userMessages" :key="id"
                >
                <div>
                    {{ userName }}
                </div>
                <div>
                    {{ createdAt? new Date(createdAt.seconds * 1000).toLocaleString() : '' }}
                </div>
                <div>
                    {{ text }}
                </div>
                </div>
            </div>
            {{ console.log(userMessages) }}
        </div>

        </div>  
        <div v-else>Loading profile...</div>
</template>

<script>
import { ref, onMounted, watch, nextTick, onServerPrefetch, onUpdated, onBeforeUpdate, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, getUser, getUserMesssages } from '@/firebase.js'
import Message from '../components/Message.vue'

export default {
    
    setup() {
        const userMessages = ref([])
        const userId = ref('')
        const route = useRoute()
        const { user } = useAuth()
        const userProfile = ref([])

        const componentKey = ref(1)

        userId.value = route.params.id
        
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
                userMessages.value,
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

</style>