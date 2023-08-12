<script setup>
import { ref } from 'vue'

const open = ref(false)
const userStatus = ref('')
const userDisplayName = ref('')
// const userProfileImage = ref('')
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
        <button @click="updateProfile">Update</button>
    </div>
    </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>