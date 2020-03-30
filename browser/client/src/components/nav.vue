<template>
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
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      imformation: false
    }
  },
  props: ['username', 'admin'],
  methods: {
    closeImg: function () {
      this.$emit('closeImg')
    }
  }
}
</script>

<style>
</style>
