<template>
    <h1>login</h1>
    <div class="login">
        <p><button @click="signIn">sign in with google</button></p>
    </div>
</template>

<script>
import { ref } from "vue"
import { useAuth } from "@/firebase"
import { useRouter } from "vue-router"


export default {
    setup() {
        const { user, isLoggedIn, signOut, signIn } = useAuth()
        return { user, isLoggedIn, signOut, signIn }
    }
}

</script>