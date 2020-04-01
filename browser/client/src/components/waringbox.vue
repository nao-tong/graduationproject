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
  border-radius: 20px;
  background-color: #ccc;
}
</style>
