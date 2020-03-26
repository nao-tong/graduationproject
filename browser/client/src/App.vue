<template>
  <div id="app">
    <Login v-if="page === 'login'" @changepage="changePage" />
    <Register v-else-if="page === 'register'" @changepage="changePage" :alter="alter" />
    <Personpage v-else @changepage="changePage" />
  </div>
</template>

<script>
import Login from './components/login'
import Register from './components/register'
import Personpage from './components/personpage'
export default {
  name: 'App',
  data () {
    return {
      page: 'login',
      alter: false
    }
  },
  methods: {
    changePage: function (page, alter) {
      this.page = page
      if (alter) {
        this.alter = alter
      } else {
        this.alter = false
      }
    }
  },
  components: {
    Login,
    Register,
    Personpage
  },
  created: function () {
    if (document.cookie) {
      this.page = 'personpage'
    }
  }
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
*{
  margin: 0;
  padding: 0;
}
body {
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
</style>
