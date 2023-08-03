<template>
    <div class="messageBodyWrapper">
        <span v-if="!sender" class="sender">{{ name }}</span>
        <!-- make the delete button a menu with delete and edit -->
        <button v-if="sender" class="deleteButton" @click="sender ? deleteUserMessage(id) : null"></button>
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
.messageBodyWrapper {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    min-width: 100%;
}

.deleteButton::after {
    display: inline-block;
    content: "\00d7"; /* This is the X character */
}

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
    margin-right: 20px;
}

.deleteButton {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 1;
    text-decoration: none;
    color: #333333;
    font-size: 18px;
    border-radius: 5px;
    width: 20px;
    height: 20px;
    border: 1px solid #333333;
    padding-right: 2px;
    position: relative;
    transition: 0.3s;
    background-color: #ffffff00;
    -webkit-transition-duration: .4s;
    margin-right: 25px;
}
.deleteButton:hover {
    background-color: #333333;
    color: #ffffff;
    cursor: pointer;
}

</style>