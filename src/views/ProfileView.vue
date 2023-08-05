<template>
    <span>profile view</span>
    <div class="userMessages" v-if="userMessages.length">
        <span>{{ userMessages.length > 0 ? userMessages[0].userName : 'ERROR, DON\'T LOOK, THERE\'S AN ERROR' }} has aired out the following:</span>
        <Message v-for="{ id, text, userName, userId, createdAt } in userMessages" 
                :key="`${id}-${userName}-${userId}-${createdAt.seconds}-${createdAt.nanoseconds}`"
                :id="userId" 
                :name="userName" 
                :sender="userId == user?.uid"
                :createdAt="createdAt"
                >
                {{ text }}
            </Message>

        </div>  
        <div v-else>Loading profile...</div>
</template>

<script>
import { ref, onMounted, } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth, getUser, getUserMesssages } from '@/firebase.js'
import Message from '../components/Message.vue'

export default {

    setup() {
        const route = useRoute()
        const userId = ref('')
        const { user } = useAuth()
        const userProfile = ref([])
        const userMessages = ref([])

        const componentKey = ref(0)

        userId.value = route.params.id

        const forceRender = () => {
            componentKey.value += 1
        }
        
        onMounted(() => {
            getUser(userId.value)
            .then(user => {
                userProfile.value = user
                forceRender()
                })
                .catch(error => console.error(error))
            
            getUserMesssages(userId.value)
                .then(messages => {
                    if (!messages.length) {
                        userMessages.value = ['user h']
                        return;
                    }
                    userMessages.value = messages;
                })
                .catch(error => console.error(error))
            });

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

<style>
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