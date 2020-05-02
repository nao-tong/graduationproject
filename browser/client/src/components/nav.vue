<template>
  <div class="nav" id="nav">
    <marquee behavior="scroll" direction="left" style="width:85%;color:red;font-size: 18px;">
      实验室注意事项：
      1、不得将饮料和事物带入化学实验室,.实验室内禁止吸烟
      2、请保持室内卫生.
      3、废纸请扔进废纸篓里.
      4、未经许可不得触摸任何物品
      5、做完试验后物品必须放回原位
      6、离开前必须关闭门窗
    </marquee>
    <img @mouseover="information = true" @mouseout="information = false" ref="headimg" src="" alt="headimg" id="headimg">
    <span v-if="admin" @click="allUser" class="updata">用户管理</span>
    <div v-show="information" @mouseover="information = true" @mouseout="information = false" class="information" id="information">
      <div class="user-username">
        <span>昵称：</span>
        <span class="username"> {{ username }} </span>
      </div>
      <div @click="alterData" class="userxiala persondate" id="persondate">
        <span>个人信息</span>
      </div>
      <div @click="exit" class="userxiala exit" id="exit">
        <span>退出</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Nav',
  data () {
    return {
      information: false,
      username: '',
      admin: false
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
    alterData: function () {
      this.$emit('changepage', 'register', true)
    },
    getUserdata: function () {
      let that = this
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      Axios.post('/datauser', {userid: cookieobj.login})
        .then(function (data) {
          if (data.data.offline) {
            that.exit()
          } else {
            if (data.data.admin === 0) {
              that.admin = true
              that.$emit('changeadmin', true)
            }
            that.username = data.data.username
            that.$refs.headimg.setAttribute('src', baseurl + data.data.headimg)
          }
        })
    },
    exit: function () {
      this.$emit('Exit')
    },
    allUser: function () {
      let that = this
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      Axios.post('/alluser')
        .then(function (data) {
          if (data.data.offline) {
            that.exit()
          } else {
            that.$emit('alluser', data.data, true)
          }
        })
    }
  },
  mounted: function () {
    this.getUserdata()
  }
}
</script>

<style scoped>
.nav {
  position: relative;
  width: 100%;
  height: 63px;
  line-height: 63px;
  -webkit-box-shadow: 0px 1px 3px 3px rgb(127, 189, 224);
  -moz-box-shadow: 0px 1px 3px 3px rgb(127, 189, 224);
  box-shadow: 0px 1px 3px 3px rgb(127, 189, 224);
}

#headimg {
  cursor: pointer;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 10px;
  right: 10%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

span.updata {
  cursor: pointer;
  position: absolute;
  top: 15px;
  right: 3%;
  width: 70px;
  height: 30px;
  color: white;
  font-size: 13px;
  background-color: royalblue;
  text-align: center;
  line-height: 34px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

div.information {
  position: absolute;
  width: 150px;
  top: 50px;
  right: 10%;
  background-color: rgb(137, 164, 243);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  z-index: 100;
}

div.information div.userxiala {
  cursor: pointer;
  padding: 5px 0;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

div.information div.userxiala:hover {
  background-color: rgb(127, 189, 224);
}

div.information div.user-username {
  width: 100%;
  height: 20px;
  padding: 5px 0;
  background-color: #2BC2FE;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  line-height: 20px;
}

div.information span {
  width: 100%;
  height: 100%;
  font-size: 13px;
}

div.information div.userxiala {
  width: 100%;
  height: 20px;
  line-height: 20px;
}
</style>
