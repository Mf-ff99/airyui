<template>
    <span>profile view</span>
    <span>{{ userId }}</span>
    <div class="userMessages">
        <span>{{ userProfile.userId }} aired out the following:</span>
        <Message class="userProfileMessages" v-for="{ id, text, userName, userId } in userMessages.userMessages" 
            :key="id"
            :id="userId" 
            :name="userName" 
            :sender="userId == user?.uid">
            {{ text }}
        </Message>
    </div>  
</template>

<script>
import { ref, onMounted } from 'vue'
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

        userId.value = route.params.id

        
        onMounted(() => {
            getUser(userId.value)
                .then(user => {
                userProfile.value = user;
                })
                .catch(error => console.error(error));
            
                getUserMesssages(userId.value)
                .then(messages => {
                userMessages.value = messages;
                console.log(userMessages)
                })
                .catch(error => console.error(error));
            
            });

        return {
            userId,
            Message,
            user,
            userProfile,
            userMessages,
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
    background-color: #eee;
}

</style>