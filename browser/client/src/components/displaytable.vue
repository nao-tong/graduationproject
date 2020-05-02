<template>
  <div class="sidebar right form" id="displaytable">
    <div class="top">
      <span ref="addtable" @click="addTable" class="upl" id="addtable">添加表</span>
      <span ref="editor" @click="editTable" class="upl" id="editor">编辑表</span>
      <span ref="charttype" @click="changeChartFlag" @mouseenter.once="getHeight" class="upl" id="charttype">图表类型</span>
      <span ref="deletetable" @click="deleteTable" class="upl" id="deletetable">删除表</span>
      <div class="chartbox">
        <ul id="charttypelist" ref="charttypelist" v-show="chartflag">
          <li class="chart"><a href="#" class="chart" ctype="line">折线图</a></li>
          <li class="chart"><a href="#" class="chart" ctype="pie">饼状图</a></li>
          <li class="chart"><a href="#" class="chart" ctype="bar">柱状图</a></li>
          <li class="chart"><a href="#" class="chart" ctype="scatter">散点图</a></li>
        </ul>
      </div>
      <div class="seach">
        <input ref="seachtdata" type="text" class="seachdata seachtdata">
        <span @click="seachTable" class="iconfont icon-tubiao- seachtable"></span>
      </div>
    </div>

    <div v-show="seachtlist.length === 0" class="bottom usertable">
      <div class="formbox" id="tablebox">
        <table border="1" frame="void" cellspacing="0" rules="groups" v-show="nowtable.tablename">
          <caption v-if="typeof(nowtable.tablename) === 'object'" class="delcaption">{{ nowtable.tablename[0] }}</caption>
          <caption v-else>{{ nowtable.tablename }}</caption>
          <tr class="col">
            <th v-for="(field, key) in nowtable.tablefield" :key="key">
              {{ field }}
            </th>
          </tr>
          <tr v-for="(item, key) in nowtable.table" :key="key" class="row" :id="'row' + nowtable.table[key].serial">
            <td v-for="(it, index) in nowtable.tablefield" :key="index" >{{ item[it] }}</td>
          </tr>
        </table>
      </div>
      <!-- 图表 -->
      <div class="chart" id="chart" v-show="chart" style="width:600px;height:300px;"></div>
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

    <div id="mychart" class="selectfield" v-show="selectfield">
      <div class="hint">
        请选择
        <span v-show="!xyflag">x轴</span>
        <span v-show="xyflag">y轴</span>
      </div>
      <div class="field" ref="field">
        <label @click="setShadow" v-for="(value, key, index) in nowtable.coldata" :key="index"><input name="field" :type="!xyflag ? 'radio' : 'checkbox'">{{ key }}</label>
      </div>
      <div class="qdqx">
        <span @click="selectConfirm">确定</span>
        <span @click="selectCancel">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from './../js/echarts'
import axios from 'axios'
export default {
  name: 'Waringbox',
  data () {
    return {
      olddate: 0,
      seachtlist: [],
      chartflag: false,
      charttype: '',
      chart: false,
      chartlistheight: '',
      selectfield: false,
      xyflag: false,
      xdata: {},
      ydata: [],
      mychart: ''
    }
  },
  watch: {
    charttype: function (newvalue, oldvalue) {
      if (newvalue === 'line') {
        this.selectfield = true
      }
    },
    nowtable: function () {
      this.xdata = {}
      this.ydata = []
      this.mychart.setOption({series: []}, true)
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
    exit: function () {
      this.$emit('Emit')
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
          if (data.data.offline) {
            that.exit()
          } else {
            if (data.data.delete) {
              that.$emit('waringbox', '删除成功')
              that.$emit('gettable')
            }
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
            if (data.data.offline) {
              that.exit()
            } else {
              if (data.data.table.length) {
                that.seachtlist = data.data.table
              } else {
                that.waringBox('无此表')
              }
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
      this.xdata = {}
      this.ydata = []
      this.mychart.setOption({series: []}, true)
      this.seachtlist = []
      this.$emit('listnowtable', e)
    },
    changeChartFlag: function () {
      let flag = this.restrictOperation()
      if (flag) {
        return
      }
      let that = this
      if (!this.chartflag) {
        // 显示
        this.$refs.charttypelist.style.height = 0 + 'px'
        this.$refs.charttypelist.style.transition = 'height .5s ease'
        this.chartflag = !this.chartflag
        setTimeout(function () {
          this.$refs.charttypelist.style.height = this.chartlistheight + 'px'
        }.bind(this), 20)
      } else {
        // 不显示
        let hidden = (function () {
          return new Promise(function (resolve) {
            setTimeout(function () {
              this.$refs.charttypelist.style.height = 0 + 'px'
              resolve()
            }.bind(that), 20)
          })
        })()
        hidden.then(function () {
          setTimeout(function () {
            this.$refs.charttypelist.style.transition = ''
            this.chartflag = !this.chartflag
          }.bind(that), 500)
        })
      }
    },
    getHeight: function () {
      this.$refs.charttypelist.style.opacity = '0.0'
      this.chartflag = true
      setTimeout(function () {
        this.chartlistheight = this.$refs.charttypelist.offsetHeight
        this.chartflag = false
        this.$refs.charttypelist.style.opacity = '1.0'
      }.bind(this), 0)
    },
    slectChartType: function (e) {
      let that = this
      let hidden = (function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            this.$refs.charttypelist.style.height = 0 + 'px'
            resolve()
          }.bind(that), 0)
        })
      })()
      hidden.then(function () {
        setTimeout(function () {
          this.$refs.charttypelist.style.transition = ''
          this.chartflag = !this.chartflag
        }.bind(that), 500)
      })
      document.getElementById('charttype').innerText = e.target.innerText
      this.charttype = e.target.getAttribute('ctype')
    },
    restrictOperation: function () {
      let flag = false
      let nowdate = new Date().getTime()
      let datesub = nowdate - this.olddate
      this.olddate = nowdate
      if (datesub < 500) {
        flag = true
      }
      return flag
    },
    waringBox: function (message) {
      this.$emit('waringbox', message)
    },
    selectConfirm: function () {
      this.ydata = []
      if (this.charttype === 'line') {
        let elearr = this.$refs.field.children
        for (let i = 0; i < elearr.length; i++) {
          if (!this.xyflag) {
            if (elearr[i].children[0].checked) {
              this.xdata = elearr[i].innerText
              this.xyflag = true
              break
            }
            if (i === elearr.length - 1) {
              if (!Object.keys(this.xdata).length) {
                this.waringBox('请选择x轴数据')
              }
            }
          } else {
            if (elearr[i].children[0].checked) {
              this.ydata.push(elearr[i].innerText)
            }
            if (i === elearr.length - 1) {
              if (!this.ydata.length) {
                this.waringBox('至少选择一个')
                return false
              }
              this.selectfield = false
              this.xyflag = false
              this.chart = true
              // let mychart = echarts.init(document.getElementById('chart'))
              let option = {
                title: {
                  text: typeof (this.nowtable.tablename) === 'object' ? this.nowtable.tablename[0] + ' 折线图' : this.nowtable.tablename + ' 折线图'
                },
                tooltip: {
                  trigger: 'axis'
                },
                legend: {
                  data: []
                },
                xAxis: {
                  data: this.nowtable.coldata[this.xdata]
                },
                yAxis: {},
                series: []
              }
              for (let i = 0; i < this.ydata.length; i++) {
                let obj = {}
                obj.name = this.ydata[i]
                obj.type = 'line'
                obj.data = this.nowtable.coldata[this.ydata[i]]
                option.legend.data.push(this.ydata[i])
                option.series.push(obj)
              }
              this.mychart.setOption(option, true)
              this.charttype = ''
            }
          }
        }
      } else { /* 其它选项 */ }
      let elearr = this.$refs.field.children
      for (let i = 0; i < elearr.length; i++) {
        elearr[i].setAttribute('class', '')
      }
    },
    selectCancel: function () {
      this.selectfield = false
      this.xyflag = false
      this.charttype = ''
      let elearr = this.$refs.field.children
      for (let i = 0; i < elearr.length; i++) {
        elearr[i].setAttribute('class', '')
      }
    },
    setShadow: function (e) {
      let ele = e.target
      if (ele.tagName === 'LABEL') {
        if (ele.children[0].type === 'radio') {
          ele.setAttribute('class', 'insetshadow')
          let siblings = ele.parentNode.children
          for (let i = 0; i < siblings.length; i++) {
            if (siblings[i] === ele) {
              continue
            } else {
              siblings[i].setAttribute('class', '')
            }
          }
        } else {
          if (!ele.children[0].checked) {
            ele.setAttribute('class', 'insetshadow')
          } else {
            ele.setAttribute('class', '')
          }
        }
      }
    }
  },
  mounted: function () {
    this.$refs.seachtlist.addEventListener('click', this.listNowTable)
    this.$refs.charttypelist.addEventListener('click', this.slectChartType)
    this.mychart = echarts.init(document.getElementById('chart'))
  }
}
</script>

<style>
input {
  opacity: 0.5;
}

.right {
  position: relative;
  width: 100%;
}

.chartbox {
  position: absolute;
  width: 84px;
  left: 197px;
  top: 40px;
  color: white;
  background-color: royalblue;
  text-align: center;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}

.chartbox ul {
  /* transition: height .5s ease; */
  width: 100%;
  overflow: hidden;
}

.chartbox ul li {
  width: 100%;
}

.chartbox ul li a.chart {
  display: block;
  width: 100%;
  height: 100%;
  padding: 2px 0;
  color: white;
}

.bottom div.formbox {
  margin-left: 4%;
}

.bottom #chart {
  position: relative;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
}

.tablebottom div.top {
  width: 100%;
  color: royalblue;
  font-size: 13px;
  margin-top: 10px;
  border: none;
}

.tablebottom div.top:hover {
  background-color: rgb(127, 189, 224);
  border: none;
}

.tablebottom div.top span {
  display: inline-block;
  padding-left: 20px;
}

.tablebottom ul li {
  cursor: pointer;
  width: 100%;
  height: 44px;
  list-style: none;
  line-height: 44px;
  border-bottom: 0.5px solid #87CEEB;
  border-top: 0.5px solid #87CEEB;
}

.tablebottom ul li:hover {
  background-color: rgb(127, 189, 224);
  border-bottom: 0.5px solid rgb(127, 189, 224);
  border-top: 0.5px solid rgb(127, 189, 224);
}

.tablebottom ul li span {
  position: relative;
  display: inline-block;
  font-size: 13px;
  padding-left: 20px;
}

.selectfield {
  width: 400px;
  height: 250px;
  background-color: rgb(114, 177, 214);
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
}

.selectfield .hint {
  color: royalblue;
}

.selectfield .field {
  width: 100%;
  height: 200px;
  min-height: 100px;
  max-height: 180px;
  overflow: auto;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-content: space-around;
}

.selectfield .field label {
  cursor: pointer;
  position: relative;
  height: 30px;
  margin: 1px 3px;
  line-height: 30px;
  padding: 0px 4px;
  text-align: center;
  border-radius: 4px;
  background-color: rgb(22, 88, 231);
  box-shadow: -3px -3px 3px rgba(6, 55, 161, 0.1), 4px 2px 6px rgba(5, 51, 151, 0.8);
}

.selectfield .field label.insetshadow {
  box-shadow: -3px -3px 3px rgba(6, 55, 161, 0.1) inset, 4px 2px 6px rgba(5, 51, 151, 0.8) inset;
}

.selectfield .field label input {
  display: none;
}

.selectfield .qdqx {
  width: 100%;
  margin-top: 10px;
  max-height: 100px;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-around;
  justify-content: space-around;
}

.selectfield .qdqx span {
  cursor: pointer;
  width: 64px;
  height: 30px;
  background-color: rgb(22, 88, 231);
  line-height: 30px;
  text-align: center;
  border-radius: 4px;
  box-shadow: -3px -3px 3px rgba(6, 55, 161, 0.1), 4px 2px 6px rgba(5, 51, 151, 0.8);
}

.selectfield .qdqx span:active {
  box-shadow: -3px -3px 3px rgba(6, 55, 161, 0.1) inset, 4px 2px 6px rgba(5, 51, 151, 0.8) inset;
}
</style>
