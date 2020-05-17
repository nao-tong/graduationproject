<template>
  <div id="rform">
    <div class="form">
        <div class="image">
            <img ref="headimgid" src="../assets/account.jpg" alt="" id="headimgid">
            <button class="headimg">上传头像</button>
            <form ref="avater" id="avater" action="/upload" method="post" enctype="multipart/form-data">
                <input ref="headimage"  @change="uploadHeadimg" type="file" name="avatar" id="headimage" />
            </form>
        </div>
        <div class="formlist">
            <form id="formlist">
                <div id="error" ref="error"></div>
                <!-- 自动生成十位数账号 -->
                <div class="username">
                    <i class="iconfont icon-zhanghu1"></i>
                    <input ref="userid" v-model="userid" type="text" id="username" name="userid" placeholder="账号" readonly>
                </div>
                <div class="username">
                    <i class="iconfont icon-zhanghu1"></i>
                    <input ref="nickname" v-model="nickname" type="text" id="nickname" name="username" placeholder="请输入昵称" autocomplete="off">
                </div>
                <div class="password">
                    <i class="iconfont icon-mima"></i>
                    <input ref="password" v-model="password" type="password" id="password" name="password" placeholder="密码" autocomplete="off">
                </div>
                <!-- 确认密码 -->
                <div class="password">
                    <i class="iconfont icon-mima"></i>
                    <input ref="verifyPassword" v-model="verifyPassword" type="password" id="verifyPassword" placeholder="确认密码" autocomplete="off">
                </div>
                <!-- 验证码 -->
                <div class="verificationCode">
                    <i class="iconfont icon-yanzhengma"></i>
                    <input ref="svgtext" v-model="verifyCode" type="text" id="verificationCode" placeholder="请输入验证码" autocomplete="off">
                    <div class="verificationCodeImg">
                        <div ref="svg" @click="refreshSvg" class="svg"></div>
                    </div>
                </div>
                <button ref="submit" @click="submit" type="button" id="submit" class="submit">注册</button>
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
  name: 'Rform',
  data () {
    return {
      svgtext: '',
      imgindex: '',
      userid: '',
      nickname: '',
      password: '',
      verifyPassword: '',
      verifyCode: ''
    }
  },
  methods: {
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
    getUserid: function () {
      let that = this
      axios.get('/user/register/createId')
        .then(function (data) {
          that.userid = data.data
        })
    },
    uploadHeadimg: function () {
      let that = this
      let img = this.$refs.headimage
      let filetype = img.files[0].name.split('.')[1]
      if (filetype === 'jpg' || filetype === 'png') {
        let imgform = new FormData(this.$refs.avater)
        axios.post('/user/upload', imgform, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
          .then(function (data) {
            that.imgindex = data.data.imgindex
            that.$refs.headimgid.setAttribute('src', baseurl + data.data.headimg)
          })
      } else {
        this.$refs.error.innerHTML = '请上传图片文件'
      }
    },
    submit: function () {
      let that = this
      let userid = this.userid
      let nickname = this.nickname
      let password = this.password
      let verifyPassword = this.verifyPassword
      let verificationCode = this.verifyCode.toLowerCase()
      let headimg = this.$refs.headimage.files.length
      let passwordflag = !(password === verifyPassword)
      let verifyflag = !(this.svgtext.toLowerCase() === verificationCode)
      let pwstring = String(this.password)
      let imgindex = this.imgindex
      if (!headimg) {
        this.$refs.error.innerHTML = '请上传头像'
      } else if (!nickname) {
        this.$refs.error.innerHTML = '昵称不能为空'
      } else if (!password) {
        this.$refs.error.innerHTML = '密码不能为空'
      } else if (pwstring.length < 6 || pwstring.length > 15) {
        this.$refs.error.innerHTML = '密码限制为6-15位'
      } else if (passwordflag) {
        this.$refs.error.innerHTML = '密码不一致'
      } else if (!verificationCode) {
        this.$refs.error.innerHTML = '请输入验证码'
      } else if (verifyflag) {
        this.$refs.error.innerHTML = '验证码不正确'
        this.$refs.svg.removeChild(that.$refs.svg.firstChild)
        axios.get('/svg')
          .then(function (data) {
            that.svgtext = data.data.text
            that.$refs.svg.innerHTML = data.data.data
            that.$refs.svg.children[0].style.width = '100%'
          })
      } else {
        this.$refs.error.innerHTML = ''
        axios.post('/user/register', {
          nickname,
          userid,
          password,
          imgindex
        })
          .then(function (data) {
            if (data.data.account) {
              that.$emit('changepage', 'login')
            } else {
              this.$refs.error.innerHTML = '服务器繁忙'
            }
          })
      }
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
    this.getUserid()
  }
}
</script>

<style scoped>
#rform {
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
  height: 470px;
  position: absolute;
  top: 40%;
  left: 50%;
  margin-top: -150px;
  margin-left: -300px;
  opacity: 0.6;
  background-color: #ccc;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.image {
  width: 200px;
  height: 200px;
  margin-top: 100px;
  margin-left: 20px;
}

img {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}

.headimg {
  position: absolute;
  bottom: 50px;
  left: 90px;
}

#avater {
  width: 56px;
  height: 20px;
  overflow: hidden;
  position: absolute;
  top: 348px;
  left: 89px;
}

#avater input {
  opacity: 0;
  width: 100%;
  height: 100%;
}

form {
  width: 200px;
  height: 200px;
  margin-top: 50px;
}

#error {
  position: absolute;
  top: 10px;
  left: 63%;
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

.username,
.password,
.verificationCode {
  position: relative;
  left: -50%;
  width: 250px;
  height: 50px;
  margin-top: 20px;
  background: #E8F0FE;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
}

#username,
#nickname,
#password,
#verifyPassword,
#verificationCode {
  position: absolute;
  top: 8px;
  left: 48px;
  width: 80%;
  height: 70%;
  padding-left: 2px;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  outline: none;
  border: none;
  background-color: #E8F0FE;
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

.verificationCodeImg .svg svg{
  width: 100%;
  height: 100%;
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
  background: #E8F0FE;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
  border-radius: 50px;
}
</style>
