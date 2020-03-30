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
  watch: {
    page: (newvalue, oldvalue) => {
      window.location.href = '#/' + newvalue
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
    },
    urlWatch: function (url) {
      if (url.indexOf('/login') !== -1) {
        this.page = 'login'
      } else if (url.indexOf('/register') !== -1) {
        this.page = 'register'
      } else {
        this.page = 'psesonpage'
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
  },
  mounted: function () {
    let that = this
    window.addEventListener('hashchange', () => {
      that.urlWatch(window.location.href)
    })
  }
}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}
body,div,form,table,th,td,tr,ul,li,a,span,img,input,button{
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
