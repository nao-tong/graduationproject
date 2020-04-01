<template>
  <div class="sidebar right addtable" id="editbox">
    <div class="top">
      <span ref="addrow" @click="addRow" class="upl" id="addrow">添加行</span>
      <span ref="addcol" @click="addCol" class="upl" id="addcol">添加列</span>
      <span ref="deleterow" @click="deleteRow" class="upl" id="deleterow">删除行</span>
      <span ref="deletecol" @click="deleteCol" class="upl" id="deletecol">删除列</span>
      <span ref="notsave" @click="notSave" class="upl" id="notsave">不保存</span>
      <span ref="saveeditor" @click="saveTable" class="upl" id="saveeditor">保存</span>
    </div>
    <div class="bottom usertable">
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
</template>

<script>
import axios from 'axios'
export default {
  name: 'Edittable',
  data () {
    return {
      delrow: [],
      delfield: []
    }
  },
  props: ['editflag', 'edittable', 'addeditflag', 'oldfield'],
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
    getTable: function () {
      this.$emit('gettable')
    },
    displayTable: function () {
      this.$emit('displaytable', false)
    },
    waringBox: function (message) {
      this.$emit('waringbox', message)
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
    addCol: function () {
      let th = document.createElement('th')
      th.className = 'addcol adc'
      th.innerHTML = '<input type="text">'
      document.getElementsByClassName('editcol')[0].appendChild(th)
      for (let i = 0; i < document.getElementsByClassName('editrow').length; i++) {
        let td = document.createElement('td')
        td.innerHTML = '<input type="text">'
        td.className = 'adc'
        document.getElementsByClassName('editrow')[i].appendChild(td)
      }
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
      this.$emit('caddeditflag', false)
      this.$emit('ceditflag', false)
      this.displayTable()
    },
    saveTable: function () {
      this.$emit('caddeditflag', false)
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
      let addcol = document.getElementsByClassName('addcol')
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
          if (i >= addcol.length) {
            break
          } else {
            if (addcol[i].children[0].value === ofield[j]) {
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
      if (!tableobj.tablename) {
        this.waringBox('表名不能为空')
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
                that.notSave()
                that.waringBox('保存成功')
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
                that.$emit('ceditflag', false)
                that.getTable()
                that.displayTable()
                that.notSave()
                that.waringBox('保存成功')
              } else {
                that.waringBox('保存失败')
              }
            })
        }
      }
    }
  },
  mounted: function () {
    document.getElementById('edittable').addEventListener('change', function (e) {
      e.target.className = 'changed'
    })
  }
}
</script>

<style>
.addtable .usertable table tr th input {
  width: 90%;
  height: 90%;
}

.addtable .usertable table tr td input {
  width: 90%;
  height: 90%;
}

.addtable .top #notsave{
  position: absolute;
  right: 120px;
}

.addtable .top #saveeditor {
  position: absolute;
  right: 20px;
}
</style>
