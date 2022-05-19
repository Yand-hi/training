<template>
  <div id="canvasPaintArea" style="width: 100%;height: 100%;">
<!--    <el-image :src="imgList.url" style="width: 100%;"></el-image>-->
    <pis-slide-view
      :file-name-list= 'imgList'
    ></pis-slide-view>
<!--    <div class="tools">-->
<!--      <el-button type="primary" @click="toggleFullScreen(false)">全屏</el-button>-->
<!--      <el-button type="danger" @click="toggleFullScreen(true)">退出全屏</el-button>-->
<!--      <el-button>上一张</el-button>-->
<!--      <el-button>下一张</el-button>-->
<!--    </div>-->

  </div>
</template>

<script>
  import pisSlideView from '@/components/pisSlideView/pisSlideView';
  export default {
    name: 'viewSlice',
    components:{pisSlideView},
    data(){
      return{
        imgList: [],
        isFullscreen: false,
      }
    },
    methods:{
      getImage(){
         let images  = JSON.parse(this.$route.query.images || "");
         this.imgList = images?.map(item=> item.includes('tct/ScanData/scannerData/') ? item : 'tct/ScanData/scannerData/'+item)
      },
      // checkFull() {
      //   let isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      //   if (isFull === undefined) {isFull = false;}
      //   return isFull
      // } ,
      // FullScreen(el){
      //   if(this.isFullscreen){//退出全屏
      //     if(document.exitFullscreen){
      //       document.exitFullscreen()
      //     }else if( document.mozCancelFullScreen){
      //       document.mozCancelFullScreen()
      //     }else if(document.webkitExitFullscreen){
      //       //改变平面图在google浏览器上面的样式问题
      //       // $("#canvasPaintArea").css("position","static").css("width","100%");
      //       // $(".buildingsFloor").css("width","70%");
      //       // $(".floor-plan").css("width","78%");
      //       document.webkitExitFullscreen()
      //     }else if(!document.msRequestFullscreen){
      //       document.msExitFullscreen()
      //     }
      //   }else{
      //     if(el.requestFullscreen){
      //       el.requestFullscreen()
      //     }else if(el.mozRequestFullScreen){
      //       el.mozRequestFullScreen()
      //     }else if(el.webkitRequestFullscreen){
      //       //改变平面图在google浏览器上面的样式问题
      //       // $("#canvasPaintArea").css("position","absolute").css("width","94%");
      //       // $(".buildingsFloor").css("width","98%");
      //       // $(".floor-plan").css("width","90%");
      //       el.webkitRequestFullscreen();
      //     }else if(el.msRequestFullscreen){
      //       this.isFullscreen=true;
      //       el.msRequestFullscreen()
      //     }
      //   }
      // },
      // toggleFullScreen(flag){
      //   this.isFullscreen = flag;
      //   this.FullScreen(document.getElementById("canvasPaintArea"));
      // },

    },
    created() {
      this.getImage();
    },
    mounted() {
      // let _that=this;
      // this.toggleFullScreen(false);
      // window.onresize = function() {
      //   if (!_that.checkFull()) {
      //     _that.isFullscreen=true;
      //   }
      // }
    }
  };
</script>

<style lang="scss">
  #asideNav{
    display: none;
  }

#canvasPaintArea{
  position: relative;
  .tools{
    position: fixed;
    bottom: 20px;
    left: 44%;
  }
}
</style>
