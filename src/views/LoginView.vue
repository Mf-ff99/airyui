<template>
    <h1>login</h1>
    <div class="login">
        <p><input type="text" placeholder="email" v-model="email" /></p>
        <p><input type="text" placeholder="password" v-model="password" /></p>
        <p><button @click="signIn">submit</button></p>
        <p><button @click="signInWithGoogle">sign in with google</button></p>
    </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
const router = useRouter()

const email = ref("")
const password = ref("")
const errorMessage = ref("")

const signIn = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            // Signed in 
            const user = data.user;
            router.push('/')
            console.log(user)
            // ...
        })
        .catch((error) => {
            switch (error.code) {
                case "auth/invalid-email":
                    errorMessage.value = "Invalid email address."
                    break;
                case "auth/user-not-found":
                    errorMessage.value = "User not found."
                    break;
                case "auth/wrong-password":
                    errorMessage.value = "Wrong password."
                    break;
                default:
                    errorMessage.value = "password or email is incorrect."
                    break;
            }
        })
}

const signInWithGoogle = () => {

}

</script>