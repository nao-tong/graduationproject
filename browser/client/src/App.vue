<template>
  <div id="app">
    <Login v-if="page === 'login'" :page="page" @changepage="changePage" />
    <Register v-else-if="page === 'register'" @Exit="exit" @changepage="changePage" :alter="alter" />
    <Personpage v-else @changepage="changePage" @Exit="exit" />
  </div>
</template>

<script>
import axios from 'axios'
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
    },
    exit: function () {
      let that = this
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
      let login = new Cookie({
        name: 'login',
        value: '',
        time: -1,
        path: '/'
      })
      let user = new Cookie({
        name: 'user',
        value: '',
        time: -1,
        path: '/'
      })
      login.init()
      user.init()
      axios.post('/user/loginflag', {
        userid: cookieobj.login,
        loginflag: 0
      })
        .then(function () {
          sessionStorage.removeItem('login')
          sessionStorage.removeItem('user')
          that.changePage('login')
        })
    }
  },
  components: {
    Login,
    Register,
    Personpage
  },
  beforeCreate: function () {
    let that = this
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
    let arr = ['length', 'clear', 'setItem', 'getItem', 'key', 'removeItem']
    for (let item in sessionStorage) {
      if (arr.indexOf(item) !== -1) continue
      let cookie = new Cookie({
        name: item,
        value: sessionStorage[item],
        time: 1,
        path: '/'
      })
      cookie.init()
    }
    window.onbeforeunload = function () {
      let cookieobj = that.alaysisCookie(document.cookie)
      for (let item in cookieobj) {
        let cookie = new Cookie({
          name: item,
          value: '',
          time: -1,
          path: '/'
        })
        cookie.init()
      }
      axios.post('/user/loginflag', {
        userid: cookieobj.login,
        loginflag: 0
      })
    }
  },
  created: function () {
    let cookieobj = this.alaysisCookie(document.cookie)
    if (cookieobj.login && cookieobj.user) {
      axios.post('/user/loginflag', {
        userid: cookieobj.login,
        loginflag: 1
      })
      this.page = 'personpage'
    }
    window.location.href = '#/login'
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
