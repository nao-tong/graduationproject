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
      if (!newvalue) {
        window.location.href = '#/login'
      } else {
        window.location.href = '#/' + newvalue
      }
    }
  },
  methods: {
    alaysisCookie: cookie => {
      var group = cookie.split(';')
      var object = {}
      for (let item in group) {
        var key = group[item].split('=')[0] ? group[item].split('=')[0].trim() : 'msg'
        var value = group[item].split('=')[1] ? group[item].split('=')[1].trim() : false
        object[key] = value
      }
      return object
    },
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
    },
    delAllCookie: function () {
      class Cookie {
        constructor (cookieobj) {
          this.name = cookieobj.name
          this.value = cookieobj.value
          this.t = cookieobj.time
          this.p = cookieobj.path
        }
        init () {
          var tim = parseFloat(this.t) * 3600 * 24 * 1000
          var date = new Date()
          var time = date.getTime() + tim
          this.time = 'expires=' + (new Date(time)).toUTCString()
          this.path = 'path=' + this.p
          if (!tim) {
            this.time = ''
          }
          if (!this.p) {
            this.path = ''
          }
          document.cookie = this.name + '=' + this.value + ';' + this.time + ';' + this.path
        }
      }
      let cookieobj = this.alaysisCookie(document.cookie)
      for (let item in cookieobj) {
        new Cookie({
          name: item,
          value: '',
          time: -1,
          path: '/'
        }).init()
      }
      return '123'
    }
  },
  components: {
    Login,
    Register,
    Personpage
  },
  created: function () {
    let cookieobj = this.alaysisCookie(document.cookie)
    window.location.href = '#/login'
    if (cookieobj.login && cookieobj.user) {
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
  user-select:none;
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
