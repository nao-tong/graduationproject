<template>
  <div id="ppp">
    <Nav @changepage="changePage" @changeadmin="cAdmin" @alluser="allUser" />
    <Content :admin="admin" :adminflag="adminflag" :alluser="alluser" @changeaf="cAdminFlag" @displayimg="displayImg" @displayvideo="displayVideo" @waringbox="waringBox" />
    <Img v-show="imghref" @closeImg="closeImg" :imghref="imghref" />
    <Video v-show="videosrc" @closeVideo="closeVideo" :videosrc="videosrc" />
    <Waringbox v-show="waring" :waringtext="waringtext" />
  </div>
</template>

<script>
import Nav from './nav'
import Content from './content'
import Video from './video'
import Img from './image'
import Waringbox from './waringbox'
export default {
  name: 'Personpage',
  data () {
    return {
      admin: false,
      adminflag: false,
      alluser: [],
      imghref: '',
      videosrc: '',
      waring: false,
      waringtext: ''
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
    changePage: function (page, alter = false) {
      this.$emit('changepage', page, alter)
    },
    cAdmin: function (admin) {
      this.admin = admin
    },
    allUser: function (data, flag) {
      this.alluser = data
      this.adminflag = flag
    },
    cAdminFlag: function (data) {
      this.adminflag = data
    },
    waringBox: function (message) {
      this.waring = true
      this.waringtext = message
      setTimeout(() => {
        this.waring = false
      }, 1500)
    },
    displayImg: function (path) {
      this.imghref = path
    },
    closeImg: function () {
      this.imghref = ''
    },
    displayVideo: function (path) {
      this.videosrc = path
      // this.videosrc = e.target.getAttribute('playpath')
    },
    closeVideo: function () {
      this.videosrc = ''
    }
  },
  components: {
    Nav,
    Content,
    Video,
    Img,
    Waringbox
  }
}
</script>

<style>
#ppp {
  width: 100%;
  height: 100%;
  /*
    #87CEEB
  */
  background-image: linear-gradient(to right, #87CEEB, rgb(34, 190, 238));
  overflow: auto;
}
</style>
