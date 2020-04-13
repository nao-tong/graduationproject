<template>
  <div id="bpp" ref="bpp" @mouseover.once="snowflake">
    <!-- 背景 雪花效果 -->
    <div class="snowbox" ref="snowbox"></div>
    <!-- 表单 -->
    <div class="form">
      <div class="image">
        <img ref="headimg" src="../assets/account.jpg" alt id="headimg" />
      </div>
      <div class="formlist">
        <form>
          <div id="error" ref="error"></div>
          <div class="username">
            <i class="iconfont icon-zhanghu1"></i>
            <input ref="userid" v-model="userid" @blur="getHeadimg" type="text" id="username" name="userid" placeholder="账号" autocomplete="off"/>
          </div>
          <div class="password">
            <i class="iconfont icon-mima"></i>
            <input ref="password" v-model="password" type="password" id="password" name="password" placeholder="密码" autocomplete="off"/>
          </div>
          <!-- 验证码 -->
          <div class="verificationCode">
            <i class="iconfont icon-yanzhengma"></i>
            <input ref="svgtext" v-model="verifyCode" type="text" id="verificationCode" placeholder="请输入验证码" autocomplete="off" />
            <div class="verificationCodeImg">
              <div class="svg" ref="svg" @click="refreshSvg"></div>
            </div>
          </div>
          <button ref="submit" @click.prevent="submit" type="submit" class="submit">登录</button>
          <div class="register">
            <a href="#" @click.prevent="register">还没有账号？立即注册</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
let baseurl = 'http://127.0.0.1:3000'
axios.defaults.baseURL = baseurl
export default {
  name: 'Login',
  data () {
    return {
      svgtext: '',
      flake: true,
      timer: '',
      userid: '',
      password: '',
      verifyCode: ''
    }
  },
  methods: {
    snowflake: function () {
      let that = this
      var snowbox = this.$refs.snowbox
      var snowArray = []
      class Snowflake {
        constructor (num) {
          this.num = num
          this.init()
        }
        init () {
          var width = document.documentElement.clientWidth
          var snowbox = document.getElementsByClassName('snowbox')[0]
          var div = document.createElement('div')
          this.div = div
          div.style.position = 'absolute'
          div.className = this.num + 'snow'
          div.style.left = Math.random() * width - 7 + 'px'
          div.style.top = 0
          div.style.width = Math.random() * 7 + 3 + 'px'
          div.style.height = div.style.width
          div.style.borderRadius = 50 + '%'
          div.style.opacity = Math.random()
          div.style.backgroundColor = 'white'
          this.speed = parseInt(div.style.width) - 3
          snowbox.appendChild(div)
        }
        draw () {
          this.div.style.top = parseInt(this.div.style.top) + 1 + this.speed * 0.2 + 'px'
          this.div.style.opacity -= 0.00016
        }
      }
      function cartoon () {
        let height = document.documentElement.clientHeight - 7
        let num = 0
        that.timer = setInterval(function () {
          num++
          var snow = new Snowflake(num)
          snowArray.push(snow)
          for (let i = 0; i < snowArray.length; i++) {
            let opacity = snowArray[i].div.style.opacity
            let y = parseInt(snowArray[i].div.style.top) + parseInt(snowArray[i].div.style.width) / 2
            if (opacity <= 0 || y >= height) {
              snowbox.removeChild(
                document.getElementsByClassName(snowArray[i].div.className)[0]
              )
              snowArray.splice(i, 1)
            }
            snowArray[i].draw()
          }
        }, 100)
      }
      cartoon()
    },
    refreshSvg: function (e) {
      let that = this
      e.target.parentNode.removeChild(e.target)
      axios.get('/svg')
        .then(function (data) {
          that.svgtext = data.data.text
          that.$refs.svg.innerHTML = data.data.data
          that.$refs.svg.children[0].style.width = '100%'
        })
    },
    getHeadimg: function () {
      let that = this
      let userid = this.userid
      if (userid === '') {
        that.$refs.error.innerHTML = ''
      } else {
        axios.get('/user/judgment?userid=' + userid)
          .then(function (data) {
            if (!data.data.userid) {
              that.$refs.error.innerHTML = '账号不存在'
            } else {
              that.$refs.error.innerHTML = ''
              that.$refs.headimg.setAttribute('src', baseurl + data.data.headimg)
            }
          }, function () {
            that.$refs.error.innerHTML = '服务器错误'
          })
      }
    },
    submit: function (e) {
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
      let that = this
      let userid = this.userid
      let password = this.password
      let verifyCode = this.verifyCode.toLowerCase()
      if (!userid) {
        this.$refs.error.innerHTML = '请输入账号'
      } else if (!password) {
        this.$refs.error.innerHTML = '请输入密码'
      } else if (!verifyCode) {
        this.$refs.error.innerHTML = '请输入验证码'
      } else if (verifyCode === this.svgtext.toLowerCase()) {
        axios.post('/user/login', {
          userid,
          password
        })
          .then(function (data) {
            if (!data.data.password) {
              that.$refs.error.innerHTML = '账号或密码错误'
              that.$refs.svg.removeChild(that.$refs.svg.firstChild)
              axios.get('/svg')
                .then(function (data) {
                  that.svgtext = data.data.text
                  that.$refs.svg.innerHTML = data.data.data
                  that.$refs.svg.children[0].style.width = '100%'
                })
            } else {
              let user = new Cookie({
                name: 'user',
                value: data.data.token,
                time: 1,
                path: '/'
              })
              let login = new Cookie({
                name: 'login',
                value: data.data.id,
                time: 1,
                path: '/'
              })
              user.init()
              login.init()
              clearInterval(that.timer)
              that.$emit('changepage', 'personpage')
            }
          })
      } else {
        this.$refs.error.innerHTML = '验证码错误'
        this.$refs.svg.removeChild(this.$refs.svg.firstChild)
        axios.get('/svg')
          .then(function (data) {
            that.svgtext = data.data.text
            that.$refs.svg.innerHTML = data.data.data
            that.$refs.svg.children[0].style.width = '100%'
          })
      }
    },
    register: function () {
      clearInterval(this.timer)
      this.$emit('changepage', 'register')
    }
  },
  created: function () {
    let that = this
    axios.get('/svg')
      .then(function (data) {
        that.svgtext = data.data.text
        that.$refs.svg.innerHTML = data.data.data
        that.$refs.svg.children[0].style.width = '100%'
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#bpp{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-image: url('../assets/timg(2).jpg');
    background-repeat: no-repeat;
}

/*背景样式*/
.sonwbox {
  width: 100%;
  height: 100%;
}

/*表单样式*/
.form {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  width: 600px;
  height: 380px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -150px;
  margin-left: -300px;
  opacity: 0.6;
  background-color: #ccc;
  border-radius: 5px;
}

.image {
  width: 200px;
  height: 200px;
  margin-top: 80px;
  margin-left: 20px;
}

img {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

form {
  width: 200px;
  height: 200px;
  margin-top: 50px;
}

#error {
  position: absolute;
  top: 10px;
  left: 60%;
  color: red;
}

.iconfont {
  position: absolute;
  top: 12px;
  left: 10px;
  width: 30px;
  height: 30px;
  font-size: 25px;
}

.username,
.password,
.verificationCode {
  position: relative;
  left: -50%;
  width: 250px;
  height: 50px;
  margin-top: 20px;
  background-color: #e8f0fe;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50px;
}

#username,
#password,
#verificationCode {
  position: absolute;
  top: 8px;
  left: 48px;
  width: 80%;
  height: 70%;
  padding-left: 2px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 20px;
  outline: none;
  border: none;
  background-color: #e8f0fe;
}

.verificationCode {
  width: 150px;
}

#verificationCode {
  top: 14px;
  width: 60%;
  height: 40%;
}

.verificationCodeImg {
  position: absolute;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  left: 103%;
  width: 60%;
  height: 100%;
}

.verificationCodeImg .svg {
  width: 100%;
  height: 100%;
}

.verificationCodeImg .svg svg {
  width: 100%;
  height: 100%;
}

.password .iconfont {
  top: 13px;
  left: 13px;
  font-size: 20px;
}

.verificationCode .iconfont {
  top: 13px;
  left: 13px;
  font-size: 21px;
}

.submit {
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  margin-left: -50%;
  width: 250px;
  height: 50px;
  border: none;
  outline: none;
  background: #e8f0fe;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50px;
}

.register {
  margin-left: 50px;
  margin-top: 30px;
  font-size: 12px;
}

.register a {
  text-decoration: none;
}
</style>
