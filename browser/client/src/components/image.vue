<template>
  <div class="displayimg">
      <span @click="closeImg" class="iconfont icon-guanbi"></span>
      <img :src="imghref" alt="">
    </div>
</template>

<script>
export default {
  name: 'Img',
  data () {
    return {
    }
  },
  props: ['imghref'],
  methods: {
    closeImg: function () {
      this.$emit('closeImg')
    }
  }
}
</script>

<style>
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
</style>
