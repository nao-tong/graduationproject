<template>
  <div class="warning"> {{ waringtext }} </div>
</template>

<script>
export default {
  name: 'Waringbox',
  data () {
    return {
    }
  },
  props: ['waringtext']
}
</script>

<style>
.warning {
  position: absolute;
  left: 43%;
  bottom: 10%;
  height: 40px;
  padding: 0 20px;
  line-height: 40px;
  text-align: center;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  background-color: royalblue;
}
</style>
