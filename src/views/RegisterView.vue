<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
const router = useRouter()

const email = ref("")
const password = ref("")

const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            // Signed in 
            const user = data.user;
            router.push('/')
            console.log(user)
            // ...
        })
        .catch((error) => {
            console.log(error.code)
            alert(error.message)
        }
        )
}

</script>

<template>
    <h1>register</h1>
    <div class="register">
        <p><input type="text" placeholder="email" v-model="email" /></p>
        <p><input type="text" placeholder="password" v-model="password" /></p>
        <p><button @click="register">submit</button></p>
    </div>
</template>
