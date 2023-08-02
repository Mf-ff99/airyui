<template>
    <div class="">
        <span v-if="!sender" class="sender">{{ name }}</span>
        <button v-if="sender" @click="sender ? deleteUserMessage(id) : null">Delete</button>
        <div>
            <div class="message">
                <slot />
            </div>
        </div>
    </div>

</template>

<script>
import { useAuth, useChat } from '@/firebase'

export default {
    props: {
        name: {
            type: String,
            required: true,
            default: ''
        },
        id: {
            type: String,
            required: true,
            default: ''
        },
        sender: {
            type: Boolean,
            default: false
        }
    },
    setup() {
        const { user } = useAuth()
        
        const deleteUserMessage = (id) => useChat().deleteMessage(id)

        return {
            user,
            deleteUserMessage
        }
    }
}
</script>

<style>
.sender {
    font-weight: bold;
    margin-right: 0.5rem;
}

.message {
    background-color: #eee;
    border-radius: 0.5rem;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    display: inline-block;
}

</style>