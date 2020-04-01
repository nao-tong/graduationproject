<template>
  <div class="sidebar right form" id="displaytable">
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

    <div v-show="seachtlist.length === 0" class="bottom usertable">
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
</template>

<script>
import axios from 'axios'
export default {
  name: 'Waringbox',
  data () {
    return {
      seachtlist: []
    }
  },
  props: ['nowtable'],
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
            that.$emit('waringbox', '删除成功')
            that.$emit('gettable')
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
    addTable: function () {
      this.$emit('addtable')
    },
    editTable: function () {
      this.$emit('edittable')
    },
    listNowTable: function (e) {
      this.seachtlist = []
      this.$emit('listnowtable', e)
    }
  },
  mounted: function () {
    this.$refs.seachtlist.addEventListener('click', this.listNowTable)
  }
}
</script>

<style>
.content .right {
  position: relative;
  width: 100%;
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
</style>
