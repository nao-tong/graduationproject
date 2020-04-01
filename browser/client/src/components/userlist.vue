<template>
  <div class="alluser">
      <div class="top">
        <span class="s s1">账号</span>
        <span class="s s2">用户名</span>
        <span class="s s3">用户类型</span>
        <span>重置密码</span>
      </div>
      <ul>
        <li v-for="(user,key) in alluser" :key="key">
          <span class="s s1">{{ user.userid }}</span>
          <span class="s s2">{{ user.username }}</span>
          <span v-if="user.admin === 0" class="s s3">管理员</span>
          <span v-else class="s s3">普通用户</span>
          <span @click="resetPassword" class="reset" :userid="user.userid">重置</span>
        </li>
      </ul>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Userlist',
  data () {
    return {
    }
  },
  props: ['alluser'],
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
    resetPassword: function (e) {
      let that = this
      let userid = e.target.getAttribute('userid')
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.post('/resetPassword', {userid})
        .then(function (data) {
          if (data.data) {
            that.waringBox('重置成功')
          }
        })
    },
    waringBox: function (message) {
      this.$emit('waringbox', message)
    }
  }
}
</script>

<style>
.content .alluser {
  width: 100%;
  font-size: 13px;
}

.content .alluser ul {
  width: 100%;
}

.content .alluser ul li {
  width: 100%;
  height: 44px;
  list-style: none;
  line-height: 44px;
  border-bottom: 0.5px solid #F4FBFF;
  border-top: 0.5px solid #F4FBFF;
}

.content .alluser ul li:hover {
  background-color: #F4FBFF;
  border-bottom: 0.5px solid #DAEBFE;
  border-top: 0.5px solid #DAEBFE;
}

.content .alluser div.top {
  width: 100%;
  color: #CACED0;
  font-size: 13px;
  margin-top: 10px;
  border: none;
}

.content .alluser div.top:hover {
  background-color: #F4FBFF;
  border: none;
}

.content .alluser span {
  display: inline-block;
  padding-left: 20px;
}

.content .alluser span.reset {
  cursor: pointer;
  width: 35px;
  height: 20px;
  padding-left: 0;
  line-height: 20px;
  color: white;
  background-color: royalblue;
  text-align: center;
  border-radius: 2px;
}

.content .alluser span.s1 {
  width: 25%;
}

.content .alluser span.s2 {
  width: 25%;
}

.content .alluser span.s3 {
  width: 25%;
}
</style>
