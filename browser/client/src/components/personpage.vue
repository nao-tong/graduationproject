<template>
  <div id="ppp">
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
        <span v-show="admin" class="updata">用户管理</span>
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
    <div class="content">
        <div class="sidebar left">
            <div class="leftxiala">
                <!-- 点击显示二级菜单 -->
                <span @click="displayFile(false)" ref="displayfile" class="xiala files" id="xialafile">文件</span>
                <div v-show="flist" ref="secondfile" class="secondbox secondfile">
                  <span class="second">视频</span>
                  <span class="second">图片</span>
                  <span class="second">文本</span>
                </div>
            </div>
            <div class="leftxiala">
                <span ref="displaytable" @click="displayTable(false)" class="xiala tables" id="xialatable">用户数据表</span>
                <div v-show="tlist" ref="nowtable" class="secondbox secondtable" id="tablelist">
                  <span v-for="(table,key) in tablelist" :key="key" class="second">{{ table }}</span>
                </div>
            </div>
        </div>

        <div v-show="file" class="sidebar right file" id="displayfile">
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
                <!-- 1、文件显示
                -->
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

        <div v-show="table" class="sidebar right form" id="displaytable">
            <div class="top">
                <span ref="addtable" @click="addTable" class="upl" id="addtable">添加表</span>
                <span ref="editor" @click="editTable" class="upl" id="editor">编辑表</span>
                <span ref="charttype" class="upl" id="charttype">图表类型</span>
                <span ref="deletetable" @click="deleteTable" class="upl" id="deletetable">删除表</span>
                <div class="chartbox">
                    <ul id="charttypelist">
                        <li class="chart "><a href="#" class="chart">折线图</a></li>
                        <li class="chart "><a href="#" class="chart">饼状图</a></li>
                        <li class="chart "><a href="#" class="chart">柱状图</a></li>
                        <li class="chart "><a href="#" class="chart">散点图</a></li>
                    </ul>
                </div>
                <div class="seach">
                    <input ref="seachtdata" type="text" class="seachdata seachtdata">
                    <span @click="seachTable" class="iconfont icon-tubiao- seachtable"></span>
                </div>
            </div>

            <!--  -->
            <div v-show="seachtlist.length === 0" class="bottom usertable">
                <!-- 1、数据表的删除
                     2、数据更新
                     3、自动追加更新时间
                     4、添加字段

                     删除数据表（数据）后自动发请求刷新用户表
                -->

                <!-- 表格 -->
                <div class="formbox" id="tablebox">
                  <table border="1" frame="void" cellspacing="0" rules="groups">
                    <caption v-if="typeof(nowtable.tablename) === 'object'" class="delcaption">{{ nowtable.tablename[0] }}</caption>
                    <caption v-else>{{ nowtable.tablename }}</caption>
                    <tr class="col">
                        <th v-for="(field, key) in nowtable.tablefield" :key="key">
                          <input type="checkbox">
                          {{ field }}
                        </th>
                    </tr>
                    <tr v-for="(item, key) in nowtable.table" :key="key" class="row" :id="'row' + nowtable.table[key].serial">
                        <td v-for="(it, index) in nowtable.tablefield" :key="index" >{{ item[it] }}</td>
                    </tr>
                </table>
                </div>
                <!-- 图表 -->
                <div class="chart" id="chart" style="width:600px;height:300px;"></div>
            </div>

            <div v-show="seachtlist.length !== 0" class="bottom tablebottom">
                <!-- 1、文件显示
                -->
                <div class="top">
                    <span class="s s1">表名</span>
                </div>
                <ul ref="seachtlist" id="seachtlist">
                  <li v-for="(value,key) in seachtlist" :key="key" class="stl">
                    <span class="stlv">{{ value }}</span>
                  </li>
                </ul>
            </div>
        </div>

        <div v-show="editor" class="sidebar right addtable" id="editbox">
            <div class="top">
                <span ref="addrow" @click="addRow" class="upl" id="addrow">添加行</span>
                <span ref="addcol" @click="addCol" class="upl" id="addcol">添加列</span>
                <span ref="deleterow" @click="deleteRow" class="upl" id="deleterow">删除行</span>
                <span ref="deletecol" @click="deleteCol" class="upl" id="deletecol">删除列</span>
                <span ref="notsave" @click="notSave" class="upl" id="notsave">不保存</span>
                <span ref="saveeditor" @click="saveTable" class="upl" id="saveeditor">保存</span>
            </div>

            <!--  -->
            <div class="bottom usertable">
                <!-- 1、数据表的删除
                     2、数据更新
                     3、自动追加更新时间
                     4、添加字段
                     删除数据表（数据）后自动发请求刷新用户表
                -->

                <!-- 表格 -->
                <div ref="formbox" class="formbox">
                    <table v-if="!editflag" border="1" frame="void" cellspacing="0" rules="groups" id="edittable">
                        <caption class="caption"><input type="text" placeholder="请输入表名"></caption>
                        <tr class="editcol">
                            <th><input type="text"></th>
                        </tr>
                        <tr class="editrow">
                            <td><input type="text"></td>
                        </tr>
                    </table>
                    <table v-if="editflag" border="1" frame="void" cellspacing="0" rules="groups" id="edittable">
                        <caption class="caption"><input type="text" placeholder="请输入表名" :value="edittable.tablename" :baseValue="edittable.tablename"></caption>
                        <tr class="editcol">
                            <th v-for="(field,index) in edittable.field" :key="index"><input type="text" :value="field" :baseValue="field"></th>
                        </tr>
                        <tr v-for="(row,index) in edittable.rowdata" :key="index" class="editrow" :id="'editrow' + row.serial">
                            <td v-for="(field,key) in edittable.field" :key="key"><input type="text" :value="row[field]" :baseValue="row[field]"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div v-show="imghref" class="displayimg">
      <span @click="closeImg" class="iconfont icon-guanbi"></span>
      <img :src="imghref" alt="">
    </div>
    <div v-show="videosrc" class="displayvideo">
      <span @click="closeVideo" class="iconfont icon-guanbi"></span>
      <div class="video">
        <video ref="myvideo" :src="videosrc"></video>
      </div>
    </div>
    <div v-show="waring" ref="error" class="warning"> {{ waringtext }} </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Personpage',
  data () {
    return {
      olddate: '',
      admin: false,
      username: '',
      information: false,
      waring: false,
      waringtext: '123',
      imghref: '',
      videosrc: '',
      playvideo: false,
      fullscreen: false,
      seachfile: '',
      oldfield: '',
      delrow: [],
      delfield: [],
      file: true,
      flist: false,
      table: false,
      tlist: false,
      editor: false,
      editflag: false,
      addtable: true,
      tablelist: [],
      seachtlist: [],
      nowtable: {},
      edittable: {},
      filelist: []
    }
  },
  methods: {
    alaysisCookie: function (cookie) {
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
      Axios.post('/datauser', {userid: cookieobj.login})
        .then(function (data) {
          if (data.data.admin === 0) {
            that.admin = true
          }
          that.username = data.data.username
          that.$refs.headimg.setAttribute('src', baseurl + data.data.headimg)
        })
    },
    getTable: function () {
      let that = this
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.post('/alltable', {userid: cookieobj.login})
        .then(function (data) {
          that.oldfield = data.data.tablefield
          if (!data.data.message) {
            that.waring = true
            that.waringtext = '请添加表格'
            setTimeout(() => {
              that.waring = false
            }, 1500)
          } else {
            that.tablelist = data.data.tablename
            that.nowtable = data.data
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
        Axios.post('/findfile', {userid: cookieobj.login})
          .then(data => {
            that.filelist = data.data
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
        Axios.post('/findfile', {userid: cookieobj.login})
          .then(data => {
            that.filelist = data.data
          })
      }
    },
    exit: function () {
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
      let exit = new Cookie({
        name: 'login',
        value: '',
        time: -1,
        path: '/'
      })
      let et = new Cookie({
        name: 'user',
        value: '',
        time: -1,
        path: '/'
      })
      exit.init()
      et.init()
      this.$emit('changepage', 'login')
    },
    alterUserdata: function () {
      // 传递参数（显示哪个form表单）
      this.$emit('changepage', 'register')
    },
    restrictOperation: function () {
      let flag = false
      let nowdate = new Date().getTime()
      let datesub = nowdate - this.olddate
      this.olddate = nowdate
      if (datesub < 500) {
        flag = true
        this.waring = true
        this.waringtext = '操作频繁'
        setTimeout(() => {
          this.waring = false
        }, 1500)
      }
      return flag
    },
    waringBox: function (message) {
      this.waring = true
      this.waringtext = message
      setTimeout(() => {
        this.waring = false
      }, 1500)
    },
    fileSecond: function () {
      let flag = this.restrictOperation()
      if (!flag) {
        this.getFile()
      }
    },
    tableSecond: function () {
      let flag = this.restrictOperation()
      if (!flag) {
        this.getTable()
      }
    },
    seachFile: function () {
      let message = this.seachfile
      if (!message) {
        this.seachfile = '请输入相关信息'
      } else {
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
              if (data.data) {
                that.getFile(data.data)
              } else {
                that.waringBox('服务器开小差了')
              }
            })
        }
      }
    },
    flieClass: function (e) {
      if (this.editflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
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
            if (data.data) {
              that.getFile(data.data)
            } else {
              that.waringBox('服务器开小差了')
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
            if (data.data) {
              that.getFile()
            } else {
              that.waringBox('服务器开小差了')
            }
          })
      }
    },
    uploadFile: function () {
      let that = this
      let fileform = new FormData(this.$refs.avater)
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
        .then(() => {
          that.getFile()
        })
    },
    displayImg: function (e) {
      if (e.target.className.indexOf('displayimage') !== -1) {
        if (e.target.className.indexOf('name') !== -1) {
          this.imghref = e.target.parentNode.href
        } else {
          this.imghref = e.target.href
        }
      } else {
        return false
      }
    },
    closeImg: function () {
      this.imghref = ''
    },
    displayVideo: function (e) {
      this.videosrc = e.target.getAttribute('playpath')
    },
    closeVideo: function () {
      this.videosrc = ''
    },
    displayFile: function (flag) {
      if (this.editflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
      if (!flag) {
        this.flist = !this.flist
        this.file = true
        this.table = false
        this.editor = false
      } else {
        this.file = true
        this.table = false
        this.editor = false
      }
    },
    displayTable: function (flag) {
      if (this.editflag) {
        this.waringBox('请先保存或不保存')
        return false
      }
      this.seachtlist = []
      if (!flag) {
        this.tlist = !this.tlist
        this.file = false
        this.table = true
        this.editor = false
      } else {
        this.file = false
        this.table = true
        this.editor = false
      }
    },
    displayEditor: function () {
      this.file = false
      this.table = false
      this.editor = true
    },
    nowTable: function (e) {
      if (this.editflag) {
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
            that.nowtable = data.data
            that.oldfield = data.data.tablefield
            that.displayTable(true)
          })
      }
    },
    addTable: function () {
      this.displayEditor()
    },
    addCol: function () {
      let th = document.createElement('th')
      th.className = 'addcol adc'
      th.innerHTML = '<input type="text">'
      document.getElementsByClassName('editcol')[0].appendChild(th)
      // for (let i = 0; i < document.getElementsByClassName('editcol').length; i++) {
      //   document.getElementsByClassName('editcol')[i].appendChild(th)
      // }
      for (let i = 0; i < document.getElementsByClassName('editrow').length; i++) {
        let td = document.createElement('td')
        td.innerHTML = '<input type="text">'
        td.className = 'adc'
        document.getElementsByClassName('editrow')[i].appendChild(td)
      }
    },
    addRow: function () {
      let tr = document.createElement('tr')
      for (let i = 0; i < document.getElementsByClassName('editcol')[0].children.length; i++) {
        let td = document.createElement('td')
        let input = document.createElement('input')
        td.appendChild(input)
        tr.appendChild(td)
      }
      tr.className = 'editrow addrow'
      document.getElementById('edittable').appendChild(tr)
    },
    deleteRow: function () {
      let rowarr = document.getElementsByClassName('editrow')
      let rowlength = rowarr.length
      if (rowlength === 1) {
        this.waringBox('至少一行')
      } else {
        if (rowarr[rowlength - 1].getAttribute('id')) {
          this.delrow.push(rowarr[rowlength - 1].getAttribute('id').split('editrow')[1])
        }
        rowarr[rowlength - 1].parentNode.removeChild(rowarr[rowlength - 1])
      }
    },
    deleteCol: function () {
      let fieldlength = document.getElementsByClassName('editcol')[0].children.length
      let lastfield = document.getElementsByClassName('editcol')[0].children[fieldlength - 1]
      let rowlength = document.getElementsByClassName('editrow').length
      if (fieldlength === 1) {
        this.waringBox('至少一列')
      } else {
        if (lastfield.children[0].getAttribute('baseValue') !== null) {
          this.delfield.push(lastfield.children[0].getAttribute('baseValue'))
        }
        lastfield.parentNode.removeChild(lastfield)
        for (let i = 0; i < rowlength; i++) {
          document.getElementsByClassName('editrow')[i].children[fieldlength - 1].parentNode.removeChild(document.getElementsByClassName('editrow')[i].children[fieldlength - 1])
        }
      }
    },
    editTable: function () {
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
    clearEle: function (ele) {
      while (ele.children.length) {
        for (let i = 0; i < ele.children.length; i++) {
          ele.children[i].parentNode.removeChild(ele.children[i])
        }
      }
    },
    notSave: function () {
      while (document.getElementsByClassName('adc').length) {
        let adc = document.getElementsByClassName('adc')
        for (let i = 0; i < adc.length; i++) {
          adc[i].parentNode.removeChild(adc[i])
        }
      }
      while (document.getElementsByClassName('addrow').length) {
        let addrow = document.getElementsByClassName('addrow')
        for (let i = 0; i < addrow.length; i++) {
          addrow[i].parentNode.removeChild(addrow[i])
        }
      }
      this.editflag = false
      this.displayTable()
    },
    saveTable: function () {
      let that = this
      let dbfield = false
      let ofield = this.oldfield
      let field = true
      let numtablename = false
      let numfield = false
      let tableobj = {}
      tableobj.oldtablename = document.getElementsByClassName('caption')[0].children[0].getAttribute('baseValue')
      tableobj.tablename = document.getElementsByClassName('caption')[0].children[0].value
      tableobj.field = []
      tableobj.rowdata = []
      tableobj.addfield = []
      tableobj.deletefield = this.delfield
      tableobj.editfield = []
      tableobj.addrowdata = []
      tableobj.delrowdata = this.delrow
      tableobj.editrowdata = []
      if (Number(tableobj.tablename)) {
        numtablename = true
      }
      let editcolth = document.getElementsByClassName('editcol')[0].children
      for (let i = 0; i < editcolth.length; i++) {
        // 字段为空
        if (!editcolth[i].children[0].value) {
          field = false
          break
        }
        // 字段是纯数字
        if (Number(editcolth[i].children[0].value)) {
          numfield = true
          break
        }
        // 重名字段
        for (let j = 0; j < editcolth.length; j++) {
          if (i === j) {
            continue
          } else {
            if (editcolth[i].children[0].value === editcolth[j].children[0].value) {
              dbfield = true
            }
          }
        }
        for (let j = 0; j < ofield.length; j++) {
          if (i === j) {
            continue
          } else {
            if (editcolth[i].children[0].value === ofield[j]) {
              dbfield = true
            }
          }
        }
        tableobj.field.push(editcolth[i].children[0].value)
      }
      let editrow = document.getElementsByClassName('editrow')
      for (let i = 0; i < editrow.length; i++) {
        let obj = {}
        for (let j = 0; j < editcolth.length; j++) {
          obj[tableobj.field[j]] = editrow[i].children[j].children[0].value
        }
        tableobj.rowdata.push(obj)
      }
      // let obj = JSON.stringify(tableobj)
      if (!tableobj.tablename) {
        this.waringBox('表明不能为空')
      } else if (!field) {
        this.waringBox('字段不能为空')
      } else if (numtablename) {
        this.waringBox('表名不能为纯数字或艺术字开头')
      } else if (numfield) {
        this.waringBox('字段不能为纯数字或艺术字开头')
      } else if (dbfield) {
        this.waringBox('字段不能重名')
      } else {
        if (!this.editflag) {
          let baseurl = 'http://127.0.0.1:3000'
          let cookieobj = this.alaysisCookie(document.cookie)
          let Axios = axios.create({
            baseURL: baseurl
          })
          Axios.defaults.headers.common['token'] = cookieobj.user
          Axios.defaults.headers.common['userid'] = cookieobj.login
          Axios.post('/addtable', tableobj)
            .then(data => {
              if (data.data.success) {
                that.getTable()
                that.displayTable()
                this.notSave()
              } else {
                that.waringBox('此表已存在')
              }
            })
        } else {
          // addfield
          let addcol = document.getElementsByClassName('addcol')
          for (let i = 0; i < addcol.length; i++) {
            tableobj.addfield.push(addcol[i].children[0].value)
          }
          // editfield
          let editcolth = document.getElementsByClassName('editcol')[0].children
          for (let i = 0; i < editcolth.length; i++) {
            let obj = {}
            let oldfield = editcolth[i].children[0].getAttribute('baseValue')
            let newfield = editcolth[i].children[0].value
            if (oldfield !== newfield) {
              if (!editcolth[i].className) {
                obj.oldfield = oldfield
                obj.newfield = newfield
                obj.tablename = tableobj.tablename
                tableobj.editfield.push(obj)
              }
            }
          }
          // addrowdata
          let addrow = document.getElementsByClassName('addrow')
          for (let i = 0; i < addrow.length; i++) {
            let obj = {}
            for (let j = 0; j < editcolth.length; j++) {
              obj[tableobj.field[j]] = addrow[i].children[j].children[0].value
            }
            tableobj.addrowdata.push(obj)
          }
          // editrowdata
          let editrow = document.getElementsByClassName('editrow')
          for (let i = 0; i < editrow.length; i++) {
            let obj = {}
            if (editrow[i].getAttribute('id')) {
              for (let j = 0; j < editcolth.length; j++) {
                if (editrow[i].children[j].children[0].className === 'changed') {
                  obj.serial = editrow[i].getAttribute('id').split('editrow')[1]
                  obj[tableobj.field[j]] = editrow[i].children[j].children[0].value
                  tableobj.editrowdata.push(obj)
                }
              }
            }
          }
          let baseurl = 'http://127.0.0.1:3000'
          let cookieobj = this.alaysisCookie(document.cookie)
          let Axios = axios.create({
            baseURL: baseurl
          })
          Axios.defaults.headers.common['token'] = cookieobj.user
          Axios.defaults.headers.common['userid'] = cookieobj.login
          Axios.post('/edittable', tableobj)
            .then(data => {
              if (data.data.success) {
                this.editflag = false
                that.getTable()
                that.displayTable()
                this.notSave()
                that.waringBox('保存成功')
              } else {
                that.waringBox('保存失败')
              }
            })
        }
      }
    },
    deleteTable: function () {
      let that = this
      let tablename
      if (typeof (this.nowtable.tablename) === 'object') {
        tablename = this.nowtable.tablename[0]
      } else {
        tablename = this.nowtable.tablename
      }
      let baseurl = 'http://127.0.0.1:3000'
      let cookieobj = this.alaysisCookie(document.cookie)
      let Axios = axios.create({
        baseURL: baseurl
      })
      Axios.defaults.headers.common['token'] = cookieobj.user
      Axios.defaults.headers.common['userid'] = cookieobj.login
      Axios.post('/deletetable', { tablename })
        .then(data => {
          if (data.data.delete) {
            that.getTable()
          }
        })
    },
    seachTable: function () {
      let that = this
      let message = this.$refs.seachtdata.value
      if (!message) {
        this.waringBox('请输入关键信息')
      } else {
        let baseurl = 'http://127.0.0.1:3000'
        let cookieobj = this.alaysisCookie(document.cookie)
        let Axios = axios.create({
          baseURL: baseurl
        })
        Axios.defaults.headers.common['token'] = cookieobj.user
        Axios.defaults.headers.common['userid'] = cookieobj.login
        Axios.post('/querytable', { message })
          .then(data => {
            if (data.data.table.length) {
              that.seachtlist = data.data.table
            } else {
              that.waringBox('无此表')
            }
          })
      }
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
              that.nowtable = data.data
              that.oldfield = data.data.tablefield
              that.displayTable(true)
            })
        }
      }
    }
  },
  created: function () {
    this.olddate = new Date().getTime()
    this.getUserdata()
    this.getFile()
    this.getTable()
  },
  mounted: function () {
    document.getElementById('edittable').addEventListener('change', function (e) {
      e.target.className = 'changed'
    })
    this.$refs.secondfile.addEventListener('click', this.flieClass)
    this.$refs.filelist.addEventListener('click', this.deleteFile)
    this.$refs.filelist.addEventListener('click', this.displayImg)
    this.$refs.nowtable.addEventListener('click', this.nowTable)
    this.$refs.seachtlist.addEventListener('click', this.listNowTable)
    this.$refs.myvideo.controls = true
  }
}
</script>

<style>
#ppp {
  width: 100%;
  height: 100%;
}

ul {
  list-style: none;
}

table {
  width: 80%;
  margin-top: 20px;
}

tr {
  height: 30px;
  text-align: center;
}

td {
  border: 1px solid #ccc;
}

th {
  background-color: #555555;
  color: white;
  font-weight: normal;
}

a {
  text-decoration: none;
  color: black;
}

.nav {
  position: relative;
  width: 100%;
  height: 63px;
  line-height: 63px;
  box-shadow: 0px 1px 3px 3px #cccccc;
}

#headimg {
  cursor: pointer;
  position: absolute;
  width: 40px;
  height: 40px;
  top: 10px;
  right: 10%;
  border-radius: 50%;
}

span.updata {
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
  border-radius: 4px;
}

div.information {
  position: absolute;
  width: 150px;
  top: 50px;
  right: 10%;
  background-color: white;
  border-radius: 5px;
  z-index: 100;
}

div.information div.userxiala {
  cursor: pointer;
  padding: 5px 0;
  border-radius: 5px;
}

div.information div.userxiala:hover {
  background-color: #ccc;
}

div.information div.user-username {
  width: 100%;
  height: 20px;
  padding: 5px 0;
  background-color: #2BC2FE;
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

.content {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: space-between;
}

.content .left {
  width: 192px;
  height: 100%;
  text-align: center;
  background-color: rgb(240, 245, 252);
}

.content .left .leftxiala {
  display: inline-block;
  width: 100%;
}

.content .left .xiala {
  cursor: pointer;
  display: block;
  width: 100%;
  height: 42px;
  color: black;
  line-height: 42px;
}

.content .left .xiala:hover {
  background-color: #cccccc;
}

.content .left .secondtable {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.content .left .second {
  cursor: pointer;
  display: block;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
}
.content .left .second:hover {
  background-color: #cccccc;
}

.content .left .active {
  background-color: #cccccc;
}

.content .right {
  position: relative;
  width: 100%;
}

.content .file .bottom ul {
  width: 100%;
}

.content .file .bottom div.top {
  width: 100%;
  color: #CACED0;
  font-size: 13px;
  margin-top: 10px;
  border: none;
}

.content .file .bottom div.top:hover {
  background-color: #F4FBFF;
  border: none;
}

.content .file .bottom div.top span {
  display: inline-block;
  padding-left: 20px;
}

.content .file .bottom div.top span.s1 {
  width: 60%;
}

.content .file .bottom div.top span.s2 {
  width: 15%;
}

.content .file .bottom ul li input {
  position: relative;
  right: 10px;
}

.content .file .bottom ul li span {
  position: relative;
  display: inline-block;
  font-size: 13px;
  padding-left: 20px;
}

.content .file .bottom ul li span.playvideo{
  cursor: pointer;
}

.content .file .bottom ul li span.name {
  right: 20px;
}

.content .file .bottom ul li span a.download {
  position: absolute;
  right: 3%;
}

.content .file .bottom ul li span a.download i {
  font-size: 20px;
  color: black;
}

.content .file .bottom ul li span i.icon-shanchu {
  position: absolute;
  right: 7%;
  cursor: pointer;
}

.content .file .bottom ul li span i.fileid {
  display: none;
}

.content .file .bottom ul li span .fileicon {
  margin-right: 10px;
}

.content .file .bottom ul li span.s1 {
  width: 60%;
}

.content .file .bottom ul li span.s2 {
  width: 15%;
}

.content .file .bottom ul li {
  width: 100%;
  height: 44px;
  list-style: none;
  line-height: 44px;
  border-bottom: 0.5px solid #F4FBFF;
  border-top: 0.5px solid #F4FBFF;
}

.content .file .bottom ul li:hover {
  background-color: #F4FBFF;
  border-bottom: 0.5px solid #DAEBFE;
  border-top: 0.5px solid #DAEBFE;
}

.content .addtable .usertable table tr th input {
  width: 90%;
  height: 90%;
}

.content .addtable .usertable table tr td input {
  width: 90%;
  height: 90%;
}

.content .addtable .top #notsave{
  position: absolute;
  right: 120px;
}

.content .addtable .top #saveeditor {
  position: absolute;
  right: 20px;
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
  border-radius: 4px;
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

#deletetable {
  position: absolute;
  right: 20px;
}

.seach {
  position: absolute;
  height: 32px;
  width: 200px;
  padding: 0 0 0 20px;
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

.chartbox {
  display: none;
  position: absolute;
  width: 84px;
  left: 197px;
  top: 42px;
  color: white;
  background-color: royalblue;
  text-align: center;
}

.chartbox ul li {
  margin-bottom: 5px;
}

.chartbox ul li a.chart {
  color: white;
}

.bottom .chart {
  display: none;
}

.bottom div.formbox {
  margin-left: 4%;
}

.content .form .tablebottom div.top {
  width: 100%;
  color: #CACED0;
  font-size: 13px;
  margin-top: 10px;
  border: none;
}

.content .form .tablebottom div.top:hover {
  background-color: #F4FBFF;
  border: none;
}

.content .form .tablebottom div.top span {
  display: inline-block;
  padding-left: 20px;
}

.content .form .tablebottom ul li {
  width: 100%;
  height: 44px;
  list-style: none;
  line-height: 44px;
  border-bottom: 0.5px solid #F4FBFF;
  border-top: 0.5px solid #F4FBFF;
}

.content .form .tablebottom ul li:hover {
  background-color: #F4FBFF;
  border-bottom: 0.5px solid #DAEBFE;
  border-top: 0.5px solid #DAEBFE;
}

.content .form .tablebottom ul li span {
  position: relative;
  display: inline-block;
  font-size: 13px;
  padding-left: 20px;
}

.warning {
  position: absolute;
  left: 43%;
  bottom: 10%;
  height: 40px;
  padding: 0 20px;
  line-height: 40px;
  text-align: center;
  border-radius: 20px;
  background-color: #ccc;
}

.displayimg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 400px;
  transform: translateX(-50%) translateY(-50%);
}

.displayimg .iconfont {
  cursor: pointer;
  position: absolute;
  right: 0;
  font-size: 20px;
}

.displayimg img {
  display: block;
  width: 100%;
  height: 100%;
}

.displayvideo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 400px;
  transform: translateX(-50%) translateY(-50%);
}

.displayvideo .icon-guanbi {
  cursor: pointer;
  position: absolute;
  right: 0;
  font-size: 20px;
  z-index: 1;
}

.displayvideo .video {
  width: 100%;
  height: 100%;
}

.displayvideo .video video {
  width: 100%;
  height: 100%;
}
</style>
