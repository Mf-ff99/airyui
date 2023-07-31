<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Main from './components/Main.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <Main msg="You did it!" />
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

nav {
  padding: 5px;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.wrapper {
  display: flex;
  flex-direction: row;
  min-width: 500px;
}
.wrapper a {
  padding: 5px;
}

header {
  margin-top: 0;
  padding: 10px;
}

</style>
