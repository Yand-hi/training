<template>
  <div id="app" class="fill-contain">
    <router-view></router-view>
  </div>
</template>

<script>
  import appService from './App.service.js'

  export default {
    async created() {
    },
    mounted(){
      this.getDDsetting()
    },
    computed: {
      loading() {
        return this.$store.state.initLoading;
      }
    },
    methods:{
      getDDsetting(){
        appService.getDDid().then(({body})=>{
          // console.log(body);
          this.$store.commit('setInfo', body);
          // console.log(this.$store.state.info);
        })
      }
    }
  }

</script>

<style lang="scss">
  @import 'style/common';
</style>
