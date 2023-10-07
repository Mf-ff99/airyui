<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { editUserData, getUser } from '@/firebase.js'

defineProps(['userId'])

const open = ref(false)
const userStatus = ref('')
const userDisplayName = ref('')
// const userProfileImage = ref('')

 // Close Modal with click outside of Modal logic
 const closeModalOnClickOutside = (event) => {
    // Check if the click is outside the modal
    if (!event.target.closest('.modal')) {
        // If it is, close the modal
        open.value = false;
    }
};

const updateUser = (userId, userName, userStatus) => {
            // console.log(userId, userName, userStatus)
            editUserData(userId, userName, userStatus)
            .then(() => {
                getUser(userId)
                .then(user => {
                    open.value = false
                    })
                    .catch(error => console.error(error))
            })
            .catch(error => console.error(error))
}

onMounted(() => {
    // Add a click event listener to the document
    document.addEventListener('click', closeModalOnClickOutside);
})

onUnmounted(() => {
    document.removeEventListener('click', closeModalOnClickOutside);
})
</script>

<template>
    <button @click="open = true">
        Edit profile
    </button>

    <div v-if="open" class="modal">
    <div>
        <button @click="open = false">Close</button>
    </div>
    <div>

        <p>Edit profile</p>
        <input v-model="userStatus" type="text" placeholder="Update your status" />
        <input v-model="userDisplayName" type="text" placeholder="Update your display name" />
        <button @click="updateUser(userId, userDisplayName, userStatus)">Update</button>
    </div>
    </div>
</template>

<style scoped>
/* mobile first css */
@media screen and (max-width: 800px) {

}

@media screen and (min-width: 800px) {

}
</style>