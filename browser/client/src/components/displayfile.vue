<template>
  <div class="sidebar right file" id="displayfile">
    <div class="top">
      <span class="upl" id="upload">上传</span>
      <form ref="avater" id="avater" action="/upload" method="post" enctype="multipart/form-data">
        <input @change="uploadFile" type="file" name="avatar" id="uploadfile" />
      </form>
      <span @click="allFile" class="upl allfile" id="allfile">全部文件</span>
      <div class="seach">
        <input v-model="seachfile" type="text" class="seachdata seachfdata">
        <span @click="seachFile" class="iconfont icon-tubiao- seachfile"></span>
      </div>
    </div>

    <div class="bottom">
      <div class="top">
        <span class="s s1">文件名</span>
        <span class="s s2">文件大小</span>
        <span class="s s3">修改日期</span>
      </div>
      <ul ref="filelist" id="filelist">
        <li v-for="(file,key) in filelist" :key="key">
          <span class="s s1 filename">
            <input name="Fruit" type="checkbox" value="" />
            <i v-if="file.filetype === 'image'" class="iconfont icon-tupian fileicon"></i>
            <i v-else-if="file.filetype === 'video'" class="iconfont icon-video- fileicon"></i>
            <i v-else class="iconfont icon-icon fileicon"></i>
            <a onclick="return false" v-if="file.filetype === 'image'" :href="'http://127.0.0.1:3000' + file.filepath" target="_blank" class="displayimage"><span class="name displayimage">{{ file.filename }}</span></a>
            <span @click="displayVideo" v-else-if="file.filetype === 'video'" class="name playvideo" :playpath="'http://127.0.0.1:3000' + file.filepath">{{ file.filename }}</span>
            <span v-else class="name">{{ file.filename }}</span>
            <a :href="file.filepath" class="download" :download="file.fullname"><i class="iconfont icon-xiazai"></i></a>
            <i class="iconfont icon-shanchu"></i>
            <i class="fileid">{{ file.fileid }}</i>
          </span>
          <span class="s s2 filesize">{{ file.filesize }}</span>
          <span class="s s3 date">{{ file.updt }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Displayfile',
  data () {
    return {
      seachfile: ''
    }
  },
  props: ['filelist'],
  methods: {
    uploadFile: function () {
      this.$emit('uploadfile', this.$refs.avater)
    },
    allFile: function () {
      this.$emit('allfile')
    },
    seachFile: function () {
      let message = this.seachfile
      if (!message) {
        this.seachfile = '请输入相关信息'
      } else {
        this.$emit('seachfile', message)
      }
    },
    displayVideo: function (e) {
      this.$emit('displayvideo', e)
    },
    deleteFile: function (e) {
      this.$emit('deletefile', e)
    },
    displayImg: function (e) {
      this.$emit('displayimg', e)
    }
  },
  mounted: function () {
    this.$refs.filelist.addEventListener('click', this.deleteFile)
    this.$refs.filelist.addEventListener('click', this.displayImg)
  }
}
</script>

<style>
ul {
  list-style: none;
}

.right {
  position: relative;
  width: 100%;
}

.file .bottom ul {
  width: 100%;
}

.file .bottom div.top {
  width: 100%;
  color: #CACED0;
  font-size: 13px;
  margin-top: 10px;
  border: none;
}

.file .bottom div.top:hover {
  background-color: #F4FBFF;
  border: none;
}

.file .bottom div.top span {
  display: inline-block;
  padding-left: 20px;
}

.file .bottom div.top span.s1 {
  width: 60%;
}

.file .bottom div.top span.s2 {
  width: 15%;
}

.file .bottom ul li input {
  position: relative;
  right: 10px;
}

.file .bottom ul li span {
  position: relative;
  display: inline-block;
  font-size: 13px;
  padding-left: 20px;
}

.file .bottom ul li span.playvideo{
  cursor: pointer;
}

.file .bottom ul li span.name {
  right: 20px;
}

.file .bottom ul li span a.download {
  position: absolute;
  right: 3%;
}

.file .bottom ul li span a.download i {
  font-size: 20px;
  color: black;
}

.file .bottom ul li span i.icon-shanchu {
  position: absolute;
  right: 7%;
  cursor: pointer;
}

.file .bottom ul li span i.fileid {
  display: none;
}

.file .bottom ul li span .fileicon {
  margin-right: 10px;
}

.file .bottom ul li span.s1 {
  width: 60%;
}

.file .bottom ul li span.s2 {
  width: 15%;
}

.file .bottom ul li {
  width: 100%;
  height: 44px;
  list-style: none;
  line-height: 44px;
  border-bottom: 0.5px solid #F4FBFF;
  border-top: 0.5px solid #F4FBFF;
}

.file .bottom ul li:hover {
  background-color: #F4FBFF;
  border-bottom: 0.5px solid #DAEBFE;
  border-top: 0.5px solid #DAEBFE;
}

#avater {
  opacity: 0;
  position: absolute;
  top: 10px;
  left: 0;
  width: 84px;
  height: 34px;
  overflow: hidden;
  border-radius: 4px;
}

#uploadfile {
  width: 100%;
  height: 100%;
}

#allfile {
  position: absolute;
  right: 20px;
}
</style>
