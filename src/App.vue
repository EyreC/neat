<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <MainUI/>
</template>

<script>
import MainUI from './components/MainUI.vue'

export default {
  name: 'App',
  components: {
    MainUI
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
body {
  background-color:rgb(70, 73, 77);
  max-height: 100vh;
}
</style>
