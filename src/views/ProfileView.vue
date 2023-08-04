<template>
    <span>profile view</span>
    <span>{{ userId }}</span>
    <div class="userMessages">
        <span>{{ }} aired out the following:</span>
        <Message class="userProfileMessages" v-for="{ id, text, userName, userId } in userMessages.userMessages" 
            :key="id"
            :id="id" 
            :name="userName" 
            :sender="userId == user?.uid">
            {{ text }}
        </Message>
        {{ console.log(userProfile, 'profile') }}
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
        const userProfile = ref([])
        const userMessages = ref([])

        
        onMounted(() => {
            userId.value = route.params.id
        })
        
        userProfile.value = useChat().getUserInfo(userId.value)
        userMessages.value = useChat().getUserMessages(route.params.id)

        // userMessages = userMessages.value.filter((message) => {
        //     return message.userId == userId.value
        // })

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