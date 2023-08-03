<template>
    <span>profile view</span>
    <span>{{ userId }}</span>
    <div class="userMessages">
        <span>{{ userProfile.userName }} aired out the following:</span>
        <Message class="userProfileMessages" v-for="{ id, text, userName, userId } in userMessages.value" 
            :key="id"
            :id="id" 
            :name="userName" 
            :sender="userId == user?.uid">
            {{ text }}
        </Message>
    </div>  
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChat, useAuth } from '@/firebase'
import Message from '../components/Message.vue'

export default {

    setup() {
        const route = useRoute()
        const userId = ref('')
        const { user } = useAuth()
        const userMessages = ref([])
        const userProfile = ref([])

        userProfile.value = useChat().getUserInfo(userId.value)
        
        onMounted(() => {
            userId.value = route.params.id
        })

        userMessages.value = useChat().getUserMessages(route.params.id)
        
        console.log(userProfile, 'profile')
        return {
            userId,
            userMessages,
            Message,
            user,
            userProfile
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