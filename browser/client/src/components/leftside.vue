<template>
  <div class="sidebar left">
    <div class="leftxiala">
      <span @click="displayFile(false)" @mouseenter.once="getFheight" ref="displayfile" class="xiala files" id="xialafile">文件</span>
      <div v-show="flist" ref="secondfile" class="secondbox secondfile">
        <span class="second">视频</span>
        <span class="second">图片</span>
        <span class="second">文本</span>
      </div>
    </div>
    <div class="leftxiala">
      <span ref="displaytable" @click="displayTable(false)" @mouseenter.once="getTheight" class="xiala tables" id="xialatable">用户数据表</span>
      <div v-show="tlist" ref="nowtable" class="secondbox secondtable" id="tablelist">
        <span v-for="(table,key) in tablelist" :key="key" class="second">{{ table }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Leftside',
  data () {
    return {
      flist: false,
      tlist: false,
      fheight: '',
      theight: ''
    }
  },
  props: ['tablelist'],
  methods: {
    displayFile: function (flag) {
      let f = this.restrictOperation()
      if (f) {
        return
      }
      let that = this
      if (!this.flist) {
        // 显示
        this.$refs.secondfile.style.height = 0 + 'px'
        this.$refs.secondfile.style.transition = 'height .5s ease'
        this.flist = !this.flist
        setTimeout(function () {
          this.$refs.secondfile.style.height = this.fheight + 'px'
        }.bind(this), 20)
      } else {
        // 不显示
        let hidden = (function () {
          return new Promise(function (resolve) {
            setTimeout(function () {
              this.$refs.secondfile.style.height = 0 + 'px'
              resolve()
            }.bind(that), 20)
          })
        })()
        hidden.then(function () {
          setTimeout(function () {
            this.$refs.secondfile.style.transition = ''
            this.flist = !this.flist
          }.bind(that), 500)
        })
      }
      // this.flist = !this.flist
      this.$emit('displayfile', flag)
    },
    displayTable: function (flag) {
      let f = this.restrictOperation()
      if (f) {
        return
      }
      let that = this
      if (!this.tlist) {
        // 显示
        this.$refs.nowtable.style.height = 0 + 'px'
        this.tlist = !this.tlist
        setTimeout(function () {
          this.$refs.nowtable.style.height = this.theight + 'px'
        }.bind(this), 20)
      } else {
        // 不显示
        let hidden = (function () {
          return new Promise(function (resolve) {
            setTimeout(function () {
              this.$refs.nowtable.style.height = 0 + 'px'
              resolve()
            }.bind(that), 20)
          })
        })()
        hidden.then(function () {
          setTimeout(function () {
            this.tlist = !this.tlist
          }.bind(that), 500)
        })
      }
      this.$emit('displaytable', flag)
    },
    fileClass: function (e) {
      this.$emit('fileclass', e)
    },
    nowTable: function (e) {
      this.$emit('nowtable', e)
    },
    getFheight: function () {
      this.$refs.secondfile.style.opacity = '0'
      this.flist = true
      setTimeout(function () {
        this.fheight = this.$refs.secondfile.offsetHeight
        this.flist = false
        this.$refs.secondfile.style.opacity = '1'
      }.bind(this), 0)
    },
    getTheight: function () {
      this.$refs.nowtable.style.opacity = '0'
      this.tlist = true
      setTimeout(function () {
        this.theight = this.$refs.nowtable.offsetHeight
        this.tlist = false
        this.$refs.nowtable.style.opacity = '1'
      }.bind(this), 0)
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
    }
  },
  mounted: function () {
    this.$refs.secondfile.addEventListener('click', this.fileClass)
    this.$refs.nowtable.addEventListener('click', this.nowTable)
  }
}
</script>

<style>
.left {
  width: 192px;
  height: 100%;
  text-align: center;
  background-color: #87CEEB;
}

.left .leftxiala {
  display: inline-block;
  width: 100%;
}

.left .xiala {
  cursor: pointer;
  display: block;
  width: 100%;
  height: 42px;
  color: black;
  line-height: 42px;
}

.left .xiala:hover {
  background-color: rgb(127, 189, 224);
}

.left .secondfile {
  overflow: hidden;
  transition: height .5s ease;
}

.left .secondtable {
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: height .5s ease;
}

.left .second {
  cursor: pointer;
  display: block;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
}

.left .second:hover {
  background-color: rgb(127, 189, 224);
}

.left .active {
  background-color: #cccccc;
}
</style>
