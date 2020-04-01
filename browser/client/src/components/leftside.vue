<template>
  <div class="sidebar left">
    <div class="leftxiala">
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
</template>
<script>
export default {
  name: 'Leftside',
  data () {
    return {}
  },
  props: ['flist', 'tlist', 'tablelist'],
  methods: {
    displayFile: function (flag) {
      this.$emit('displayfile', flag)
    },
    displayTable: function (flag) {
      this.$emit('displaytable', flag)
    },
    fileClass: function (e) {
      this.$emit('fileclass', e)
    },
    nowTable: function (e) {
      this.$emit('nowtable', e)
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
  background-color: rgb(240, 245, 252);
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
  background-color: #cccccc;
}

.left .secondtable {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.left .second {
  cursor: pointer;
  display: block;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
}

.left .second:hover {
  background-color: #cccccc;
}

.left .active {
  background-color: #cccccc;
}
</style>
