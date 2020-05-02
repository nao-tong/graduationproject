<template>
  <div id="rpp">
    <Rform v-if="register" @changepage="changePage" />
    <Uform v-else @changepage="changePage" @Exit="exit" />
  </div>
</template>

<script>
import Uform from './uform'
import Rform from './rform'
export default {
  name: 'Register',
  data () {
    return {
      register: 'true',
      changepage: 'register'
    }
  },
  props: ['alter'],
  methods: {
    changePage: function (page) {
      this.changepage = page
    },
    exit: function () {
      this.$emit('Exit')
    }
  },
  watch: {
    changepage: function () {
      this.$emit('changepage', this.changepage)
    }
  },
  components: {
    Rform,
    Uform
  },
  created: function () {
    this.register = !this.alter
  }
}
</script>

<style scoped>
  #rpp {
    width: 100%;
    height: 100%;
    background-image: url('../assets/bg.jpg');
  }
</style>
