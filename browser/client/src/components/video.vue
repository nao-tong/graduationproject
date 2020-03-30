<template>
  <div class="displayvideo">
    <span @click="closeVideo" class="iconfont icon-guanbi"></span>
    <div class="video">
      <video ref="myvideo" :src="videosrc" crossOrigin="anonymous" controls></video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data () {
    return {
    }
  },
  props: ['videosrc'],
  methods: {
    closeVideo: function () {
      this.$emit('closeVideo')
    }
  }
}
</script>

<style>
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
