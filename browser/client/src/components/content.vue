<template>
  <div class="content">
    <Liftside :tablelist="tablelist" @displaytable="displayTable" @displayfile="displayFile" @fileclass="fileClass" @nowtable="nowTable" />

    <Displayfile v-show="file" :filelist="filelist" @Exit="exit" @waringbox="waringBox" @uploadfile="uploadFile" @allfile="allFile" @seachfile="seachFile" @displayvideo="displayVideo" @deletefile="deleteFile" @displayimg="displayImg" />

    <Displaytable v-show="table" :nowtable="nowtable" @Exit="exit" @waringbox="waringBox" @listnowtable="listNowTable" @gettable="getTable" @addtable="addTable" @edittable="editTable" />

    <Edittable v-show="editor" :oldfield="oldfield" @Exit="exit" :editflag="editflag" :addeditflag="addeditflag" :edittable="edittable" @gettable="getTable" @waringbox="waringBox" @ceditflag="cEditflag" @caddeditflag="cAddeditflag" @displaytable="displayTable" />
    <Userlist v-if="admin" v-show="adminflag" :alluser="alluser" @Exit="exit" @waringbox="waringBox" />
  </div>
</template>

<script>
import axios from 'axios'
import Liftside from './leftside'
import Displayfile from './displayfile'
import Displaytable from './displaytable'
import Edittable from './eidttable'
import Userlist from './userlist'
export default {
  name: 'Content',
  data () {
    return {
      olddate: '',
      adminf: false,
      oldfield: '',
      file: true,
      table: false,
      editor: false,
      editflag: false,
      addtable: true,
      addeditflag: false,
      tablelist: [],
      nowtable: {},
      edittable: {},
      filelist: []
    }
  },
  watch: {
    adminflag: function (newv, oldv) {
      if (this.addeditflag) {
        this.waringBox('请先保存或不保存')
        this.$emit('changeaf', false)
        return false
      }
      if (newv) {
        this.file = false
        this.table = false
        this.editor = false
      }
    }
  },
  components: {
    Liftside,
    Displayfile,
    Displaytable,
    Edittable,
    Userlist
  },
  props: ['admin', 'adminflag', 'alluser'],
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
    exit: function () {
      this.$emit('Exit')
    },
    getTable: function () {
      let that = this
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      Axios.post('/alltable', {userid: cookieobj.login})
        .then(function (data) {
          if (data.data.offline) {
            that.exit()
          } else {
            that.oldfield = data.data.tablefield
            if (!data.data.message) {
              that.waringBox('请添加表格')
            } else {
              that.tablelist = data.data.tablename
              that.nowtable = data.data
              that.nowtable.coldata = {}
              for (let i = 0; i < data.data.tablefield.length; i++) {
                that.nowtable.coldata[data.data.tablefield[i]] = []
                for (let j = 0; j < data.data.table.length; j++) {
                  that.nowtable.coldata[data.data.tablefield[i]].push(data.data.table[j][data.data.tablefield[i]])
                }
              }
            }
          }
        })
    },
    getFile: function (data) {
      if (data) {
        this.filelist = data
      } else {
        let that = this
        let baseurl = 'http://127.0.0.1:3000'
        let cookieobj = this.alaysisCookie(document.cookie)
        let Axios = axios.create({
          baseURL: baseurl
        })
        Axios.defaults.headers.common['token'] = cookieobj.user
        Axios.defaults.headers.common['userid'] = cookieobj.login
        Axios.post('/findfile', {userid: cookieobj.login})
          .then(data => {
            if (data.data.offline) {
              that.exit()
            } else {
              that.filelist = data.data
            }
          })
      }
    },
    allFile: function () {
      let flag = this.restrictOperation()
      if (!flag) {
        let that = this
        let baseurl = 'http://127.0.0.1:3000'
        let cookieobj = this.alaysisCookie(document.cookie)
        let Axios = axios.create({
          baseURL: baseurl
        })
        Axios.defaults.headers.common['token'] = cookieobj.user
        Axios.defaults.headers.common['userid'] = cookieobj.login
        Axios.post('/findfile', {userid: cookieobj.login})
          .then(data => {
            if (data.data.offline) {
              that.exit()
            } else {
              that.filelist = data.data
            }
          })
      }
    },
    restrictOperation: function () {
      let flag = false
      let nowdate = new Date().getTime()
      let datesub = nowdate - this.olddate
      this.olddate = nowdate
      if (datesub < 500) {
        flag = true
        this.$emit('waringbox', '操作频繁')
      }
      return flag
    },
    waringBox: function (message) {
      this.$emit('waringbox', message)
    },
    cEditflag: function (data) {
      this.editflag = data
    },
    cAddeditflag: function (data) {
      this.addeditflag = data
    },
    seachFile: function (message) {
      let flag = this.restrictOperation()
      if (!flag) {
        let that = this
        let baseurl = 'http://127.0.0.1:3000'
        let cookieobj = this.alaysisCookie(document.cookie)
        let Axios = axios.create({
          baseURL: baseurl
        })
        Axios.defaults.headers.common['token'] = cookieobj.user
        Axios.defaults.headers.common['userid'] = cookieobj.login
        Axios.post('/queryfile', {message})
          .then(data => {
            if (data.data.offline) {
              that.exit()
            } else {
              if (data.data) {
                that.getFile(data.data)
              } else {
                that.waringBox('服务器开小差了')
              }
            }
          })
      }
    },
    fileClass: function (e) {
      if (this.addeditflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
      this.$emit('changeaf', false)
      this.file = true
      this.table = false
      this.editor = false
      let that = this
      let type
      let filetype = e.target.innerText
      let flag = this.restrictOperation()
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      if (filetype === '视频') {
        type = 'video'
      } else if (filetype === '图片') {
        type = 'image'
      } else {
        type = 'text'
      }
      if (!flag) {
        Axios.post('/typefile', {type})
          .then(data => {
            if (data.data.offline) {
              that.exit()
            } else {
              if (data.data) {
                that.getFile(data.data)
              } else {
                that.waringBox('服务器开小差了')
              }
            }
          })
      }
    },
    deleteFile: function (e) {
      let hasclass = e.target.getAttribute('class')
      let target = -1
      if (hasclass !== null) {
        target = e.target.getAttribute('class').indexOf('icon-shanchu')
      }
      if (target === -1) {
        return false
      } else {
        let that = this
        let filepath = e.target.previousElementSibling.getAttribute('href')
        let fileid = e.target.nextElementSibling.innerText
        let baseurl = 'http://127.0.0.1:3000'
        let cookieobj = this.alaysisCookie(document.cookie)
        let Axios = axios.create({
          baseURL: baseurl
        })
        Axios.defaults.headers.common['token'] = cookieobj.user
        Axios.defaults.headers.common['userid'] = cookieobj.login
        Axios.post('/deletefile', {
          filepath,
          fileid
        })
          .then(data => {
            if (data.data.offline) {
              that.exit()
            } else {
              if (data.data) {
                that.getFile()
              } else {
                that.waringBox('服务器开小差了')
              }
            }
          })
      }
    },
    uploadFile: function (ele) {
      let that = this
      let fileform = new FormData(ele)
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (e) {
          // loaded代表上传了多少
          // total代表总数为多少
          var progressRate = (e.loaded / e.total)
          if (progressRate === 1) {
            that.waringBox('上传成功')
          }
        }
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      Axios.post('/uploadfile', fileform)
        .then((data) => {
          if (data.data.offline) {
            that.exit()
          } else {
            that.getFile()
          }
        })
    },
    displayImg: function (e) {
      if (e.target.className.indexOf('displayimage') !== -1) {
        if (e.target.className.indexOf('name') !== -1) {
          this.$emit('displayimg', e.target.parentNode.href)
        } else {
          this.$emit('displayimg', e.target.href)
        }
      } else {
        return false
      }
    },
    displayVideo: function (e) {
      this.$emit('displayvideo', e.target.getAttribute('playpath'))
    },
    displayFile: function (flag) {
      if (this.addeditflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
      if (!flag) {
        // this.flist = !this.flist
        this.file = true
        this.table = false
        this.editor = false
        this.$emit('changeaf', false)
      } else {
        this.file = true
        this.table = false
        this.editor = false
        this.$emit('changeaf', false)
      }
    },
    displayTable: function (flag) {
      if (this.addeditflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
      this.seachtlist = []
      if (!flag) {
        // this.tlist = !this.tlist
        this.file = false
        this.table = true
        this.editor = false
        this.$emit('changeaf', false)
      } else {
        this.file = false
        this.table = true
        this.editor = false
        this.$emit('changeaf', false)
      }
    },
    displayEditor: function () {
      this.file = false
      this.table = false
      this.editor = true
      this.$emit('changeaf', false)
    },
    nowTable: function (e) {
      if (this.addeditflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
      let that = this
      this.editflag = false
      let flag = this.restrictOperation()
      let tablename = e.target.innerText
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      if (!flag) {
        Axios.post('/nowtabledata', {tablename})
          .then(data => {
            if (data.data.offline) {
              that.exit()
            } else {
              that.nowtable = data.data
              that.nowtable.coldata = {}
              for (let i = 0; i < data.data.tablefield.length; i++) {
                that.nowtable.coldata[data.data.tablefield[i]] = []
                for (let j = 0; j < data.data.table.length; j++) {
                  that.nowtable.coldata[data.data.tablefield[i]].push(data.data.table[j][data.data.tablefield[i]])
                }
              }
              that.oldfield = data.data.tablefield
              that.displayTable(true)
            }
          })
      }
    },
    addTable: function () {
      this.addeditflag = true
      this.displayEditor()
    },
    editTable: function () {
      this.addeditflag = true
      this.editflag = true
      this.delrow = []
      this.delfield = []
      let colarr = document.getElementsByClassName('col')[0].children
      let rowarr = document.getElementsByClassName('row')
      let tableobj = {}
      tableobj.tablename = document.getElementsByTagName('caption')[0].innerText
      tableobj.field = []
      tableobj.rowdata = []
      for (let i = 0; i < colarr.length; i++) {
        tableobj.field.push(colarr[i].innerText)
      }
      for (let i = 0; i < rowarr.length; i++) {
        let obj = {}
        obj.serial = rowarr[i].getAttribute('id').split('row')[1]
        for (let j = 0; j < colarr.length; j++) {
          obj[tableobj.field[j]] = rowarr[i].children[j].innerText
        }
        tableobj.rowdata.push(obj)
      }
      this.edittable = tableobj
      this.displayEditor()
    },
    listNowTable: function (e) {
      let that = this
      this.editflag = false
      let flag = this.restrictOperation()
      let tablename
      if (e.target.className === 'stl') {
        tablename = e.target.children[0].innerText
      } else {
        tablename = e.target.innerText
      }
      if (!flag) {
        let baseurl = 'http://127.0.0.1:3000'
        let cookieobj = this.alaysisCookie(document.cookie)
        let Axios = axios.create({
          baseURL: baseurl
        })
        Axios.defaults.headers.common['token'] = cookieobj.user
        Axios.defaults.headers.common['userid'] = cookieobj.login
        if (!flag) {
          Axios.post('/nowtabledata', {tablename})
            .then(data => {
              if (data.data.offline) {
                that.exit()
              } else {
                that.nowtable = data.data
                that.nowtable.coldata = {}
                for (let i = 0; i < data.data.tablefield.length; i++) {
                  that.nowtable.coldata[data.data.tablefield[i]] = []
                  for (let j = 0; j < data.data.table.length; j++) {
                    that.nowtable.coldata[data.data.tablefield[i]].push(data.data.table[j][data.data.tablefield[i]])
                  }
                }
                that.oldfield = data.data.tablefield
                that.displayTable(true)
              }
            })
        }
      }
    }
  },
  mounted: function () {
    this.olddate = new Date().getTime()
    this.getFile()
    this.getTable()
    document.getElementById('edittable').addEventListener('change', function (e) {
      e.target.className = 'changed'
    })
  }
}
</script>

<style>
ul {
  list-style: none;
}

table {
  width: 80%;
  margin-top: 20px;
  border-radius: 4px;
  background-color: #718deb;
}

tr {
  height: 30px;
  text-align: center;
}

td {
  border: 1px solid #ccc;
}

th {
  background-color: #4f6ccc;
  color: white;
  font-weight: normal;
  border: 1px solid #ccc;
}

a {
  text-decoration: none;
  color: black;
}

.content {
  width: 100%;
  height: 90%;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}

.content .right {
  position: relative;
  width: 100%;
}

.upl {
  cursor: pointer;
  display: inline-block;
  width: 84px;
  height: 34px;
  margin-top: 10px;
  margin-right: 10px;
  background-color: royalblue;
  color: white;
  text-align: center;
  line-height: 34px;
  -webkit-bodrder-radius: 4px;
  -moz-bodrder-radius: 4px;
  border-radius: 4px;
}

#deletetable {
  position: absolute;
  right: 20px;
}

.seach {
  position: absolute;
  height: 32px;
  width: 200px;
  padding: 0 0 0 20px;
  -webkit-bodrder-radius: 32px;
  -moz-bodrder-radius: 32px;
  border-radius: 32px;
  background-color: #cccccc;
  right: 200px;
  top: 10px;
}

.seachdata {
  width: 80%;
  height: 100%;
  border: none;
  outline: none;
  background-color: #cccccc;
}

.icon-tubiao- {
  display: inline-block;
  position: absolute;
  top: 3px;
  width: 20px;
  height: 20px;
  font-size: 25px;
  color: blue;
}

.icon-tubiao-:hover {
  cursor: pointer;
}
</style>
