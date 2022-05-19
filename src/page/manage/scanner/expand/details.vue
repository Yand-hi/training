<template>
    <div>
      <div class="scanner">
        <div class="scanner-left" v-if="boxList.length>1">
          <div class="h-overflow" style="width: 40%;">
            <template v-for="(box,index) of boxList" >
              <div class="scanner-box" :key="index">
                <div>第{{index+1}}盒</div>
                <el-card shadow="never" :class="index===activeBoxIndex ? 'card is-active' : 'card'" @click.native="activeBox(index)">
                  <div v-for="i in 10"  class="flex">
                    <div  v-for="j in 4"
                          :style="
                           box[(i-1)+(j-1)*10].check === '1' ?
                          'width: 22%;border-radius: 2px;height: 8px;margin: 3px;background-color:' + slideStatus[box[(i-1)+(j-1)*10]&&box[(i-1)+(j-1)*10].status].color:
                          'box-sizing: border-box;background-color:#fff;border: 1px #CDCDCD solid;border-radius: 2px;width: 22%;height: 8px;margin: 3px;'">
                    </div>
                  </div>
                </el-card>
              </div>
            </template>
          </div>
          <div class="h-overflow" style="width: 59%;background-color: #E7EBEE;" v-if="boxList[activeBoxIndex]">
            <div v-for="(slide, j) of boxList[activeBoxIndex]" class="scanner-slide1">
              <div :class="parseInt(j) === parseInt(activeSlideIndex) ? 'scanner-slide is-active' : 'scanner-slide'"
                   :key="j"
                   @click="activeSlide(j)">
                <div style="text-align: left;font-size: 14px">
                  <el-checkbox  v-model="slide.check" :true-label="'1'" :false-label="'0'">{{ slide.index }} {{ slide.scale }}x  {{slide.slice_no}}</el-checkbox>
                </div>
                <div style="position: relative">
                  <div v-if="slide.slice_preview" style="width:100%;height: 113px">
                    <el-image  style="width:100%;height: 113px"
                              :src="imgUrl+slide.slice_preview">
                    </el-image>
                  </div>

                  <div v-else style="width: 100%;min-height: 113px;display: flex;justify-content: center">
                    <el-image
                      style="height: 113px;"
                      src="../../../../assets/img/imgDad.svg">
                    </el-image>
                  </div>
                  <el-tag size="mini"
                          effect="dark"
                          v-if="slide.check=== '1'"
                          style="position: absolute; left: 0px;bottom: 0px;border: 0"
                          :color="slideStatus[slide.status].color">
                    {{ slideStatus[slide.status].label }}
                  </el-tag>
                  <el-tag size="mini"
                          v-else
                          effect="dark"
                          :hit="true"
                          style="color: #0E1935;position: absolute; left: 0px;bottom: 2px;border-color: #6f6f6f"
                          :color="'rgba(205, 205, 205, 0.3)'">
                    未选中
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="scanner-left" v-else>
          <div class="h-overflow" style="width: 100%;margin-top: 5px;background-color: #E7EBEE;" v-if="boxList[activeBoxIndex]">
            <div v-for="(slide, j) of boxList[activeBoxIndex]" class="scanner-slide2">
              <div :class="parseInt(j) === parseInt(activeSlideIndex) ? 'scanner-slide is-active' : 'scanner-slide'"
                   :key="j"
                   @click="activeSlide(j)">
                <div style="text-align: left;font-size: 14px">
                  <span :true-label="1" :false-label="0" v-model="slide.check">{{ slide.index }} {{ slide.scale }}x {{slide.slice_no}}</span>
                </div>
                <div style="position: relative">
                  <el-image v-if="slide.slice_preview" style="width: 360px; height: 183px;margin-left: 5px"
                            :src="imgUrl+slide.slice_preview">
                  </el-image>
                  <div v-else class="dad_img">
                    <el-image
                      src="../../../../assets/img/imgDad.svg">
                    </el-image>
                  </div>
                  <el-tag size="mini"
                          effect="dark"
                          v-if="slide.check=== '1'"
                          style="position: absolute; left: 5px;bottom: 3px;border: 0"
                          :color="slideStatus[slide.status].color">
                    {{ slideStatus[slide.status].label }}
                  </el-tag>
                  <el-tag size="mini"
                          v-else
                          effect="dark"
                          :hit="true"
                          style="color: #0E1935;position: absolute; left: 5px;bottom: 4px;border-color: #6f6f6f"
                          :color="'rgba(205, 205, 205, 0.3)'">
                    未选中
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="scanner-body">
          <el-image style="width: 100%;padding: 0 5px 0 5px;min-height: 522px"
                    v-if="boxList[activeBoxIndex][activeSlideIndex] && boxList[activeBoxIndex][activeSlideIndex].slice_preview"
                    :src="imgUrl+boxList[activeBoxIndex][activeSlideIndex].slice_preview">
          </el-image>
          <div v-else class="dad_img">
            <el-image
              src="../../../../assets/img/imgDad.svg">
            </el-image>
          </div>
        </div>
        <div class="scanner-right h-overflow">
          <el-form>
            <!--              <el-form-item>-->
            <!--                <el-button size="mini" type="primary">全部取消</el-button>-->
            <!--                <el-button size="mini" type="success">全部加入</el-button>-->
            <!--              </el-form-item>-->
            <div class="margin-t-b-5">
              <div class="margin-t-b-5"><span>选中的标签条码</span></div>
              <el-image
                v-if="boxList[activeBoxIndex][activeSlideIndex]&&boxList[activeBoxIndex][activeSlideIndex].slice_label"
                :src="imgUrl+boxList[activeBoxIndex][activeSlideIndex].slice_label"
                style="width: 180px; height: 110px;margin-left: 2px">
              </el-image>
              <div v-else class="dad_img">
                <el-image
                  src="../../../../assets/img/imgDad.svg">
                </el-image>
              </div>
            </div>

            <div class="margin-t-b-8">
              <span>切片病理号:
                <el-tag style="font-size: 14px" v-if="boxList[activeBoxIndex][activeSlideIndex]">
                  {{boxList[activeBoxIndex][activeSlideIndex].slice_no}}
                </el-tag>
              </span>
            </div>



            <div class="margin-t-b-5">切片参数</div>
            <el-form-item label="扫描类型" required >
              <el-select  :disabled="true" v-model="boxList[activeBoxIndex][activeSlideIndex].scan_type" size="mini" class="w-100" placeholder="选择类型">
                <el-option :value="0" label="正常扫描"></el-option>
                <el-option :value="1" label="精细扫描"></el-option>
                <el-option :value="2" label="智能扫描"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="margin-t-b-5" label="切片类型" required >
              <el-select disabled v-model="boxList[activeBoxIndex][activeSlideIndex].slice_type" size="mini" class="w-100" placeholder="选择类型">
                <el-option value="0" label="HE切片"></el-option>
                <el-option value="1" label="免疫组化"></el-option>
                <el-option value="2" label="细胞"></el-option>
                <el-option value="3" label="其他"></el-option>
              </el-select>
            </el-form-item>
            <div class="margin-t-b-8">
              <span>扫描层数</span>
              <div style="margin-left: 15px">
                <el-radio-group v-model="boxList[activeBoxIndex][activeSlideIndex].level===1 ? 1 : 2"   :readonly="true">
                  <el-radio :label="1" >单层</el-radio>
                  <el-radio :label="2" >多层</el-radio>
                </el-radio-group>
              </div>

              <div class="plies">
                <div v-if="boxList[activeBoxIndex][activeSlideIndex].level>1" >
                  <el-checkbox :label="boxList[activeBoxIndex][activeSlideIndex].depthup"
                               :true-label="1"
                               :false-label="0"
                               disabled
                               style="display: flex;justify-content: center;margin: 5px 0 5px 0"
                  >融合</el-checkbox>
                  <div>层数<el-input-number
                    disabled
                    v-model="boxList[activeBoxIndex][activeSlideIndex].level"
                    :min="1" :max="9999" size="mini"
                    controls-position="right">
                  </el-input-number>层</div>
                  <div>层距<el-input-number
                    disabled
                    v-model="boxList[activeBoxIndex][activeSlideIndex].distance"
                    :min="1" :max="9999" size="mini" controls-position="right">
                  </el-input-number>M</div>

                </div>
              </div>
            </div>
            <!--              <el-form-item label="扫描层数" class="plies">-->
            <!--                <el-radio-group v-model="boxList[activeBoxIndex][activeSlideIndex].level===1 ? 1 : 2"   :readonly="true">-->
            <!--                  <el-radio :label="1" >单层</el-radio>-->
            <!--                  <el-radio :label="2" >单层</el-radio>-->
            <!--                </el-radio-group>-->
            <!--              </el-form-item>-->

            <div class="margin-t-b-8">
              <div class="margin-t-b-8">切片倍率</div>
              <div style="margin-left: 15px">
                <el-radio-group v-model="boxList[activeBoxIndex][activeSlideIndex].scale===20 ? 20:40 "  :readonly="true">
                  <el-radio :label="20" >20倍率</el-radio>
                  <el-radio :label="40" >40倍率</el-radio>
                </el-radio-group>
<!--                <el-switch-->
<!--                   :readonly="true"-->
<!--                  v-model="boxList[activeBoxIndex][activeSlideIndex].scale"-->
<!--                  active-value="20"-->
<!--                  inactive-value="40"-->
<!--                  active-text="20倍率"-->
<!--                  inactive-text="40倍率">-->
<!--                </el-switch>-->
              </div>
            </div>

            <el-divider></el-divider>
            <span>状态色号说明</span>
            <div class="scan-status-list">
              <div class="scan-status-box">
                <div class="scan-status info"></div><div>未扫描</div>
              </div>
              <div class="scan-status-box">
                <div class="scan-status is-view"></div><div>预览成功</div>
              </div>
              <div class="scan-status-box">
                <div class="scan-status scan"></div><div>扫描中</div>
              </div>
              <div class="scan-status-box">
                <div class="scan-status success"></div><div>成功</div>
              </div>
              <div class="scan-status-box">
                <div class="scan-status no-slice"></div><div>无切片</div>
              </div>
              <div class="scan-status-box">
                <div class="scan-status failure"></div><div>失败</div>
              </div>
              <div class="scan-status-box">
                <div class="scan-status is-check"></div><div>未选中</div>
              </div>
            </div>

          </el-form>
        </div>
      </div>
      <div class="scanner-tools-box">
        <div class="scanner-tools">
          <div class="tools-left">
            <div class="ratio">
              <span>{{boxList[activeBoxIndex][activeSlideIndex].scale}}x</span>
              <div>已选切片倍率</div>
            </div>
          </div>
          <div class="tools-center">
            <div class="flex" style="width: 100%">
              <div style="margin-right:10px">当前进度</div>
              <el-progress style="width: 88%" :text-inside="true" :stroke-width="22" :percentage="parseInt(boxList[activeBoxIndex][activeSlideIndex].slice_progress)"></el-progress>
              <div></div>
              <!--                {{parseInt(boxList[activeBoxIndex][activeSlideIndex].slice_progress)}}%-->
            </div>

            <div class="flex" style="margin-top:20px;width: 100%">
              <div style="margin-right:10px">总体进度</div>
              <el-progress style="width: 88%" :text-inside="true" :stroke-width="22" :percentage="activePercentage*100" status="success"></el-progress>
              <div>{{this.scannistor.done+'/'+this.scannistor.load}}</div>
              <!--                <div>{{activePercentage*100%100 + '%'}}</div>-->
            </div>
          </div>
          <div class="tools-right" >
            <el-button v-if="boxList[activeBoxIndex][activeSlideIndex].check==='0'||[4,5].includes(boxList[activeBoxIndex][activeSlideIndex].status)" class="tools-button is-de" @click="getScanDetail(false)">
              扫描
            </el-button>
            <el-button v-else class="tools-button" @click="getScanDetail(false)">
              {{boxList[activeBoxIndex][activeSlideIndex].status===2 ? '停止':'扫描'}}
            </el-button>

            <el-button v-if="[1,3].includes(boxList[activeBoxIndex][activeSlideIndex].status)" class="tools-button" @click="viewSlides()">浏览</el-button>
            <el-button v-else class="tools-button  is-de" @click="viewSlides()">浏览</el-button>

            <!--              <el-button class="tools-button" @click="()=>{}">预览</el-button>-->
          </div>

        </div>
      </div>
    </div>
</template>

<script>
  import {imgUrl} from '@/config/utils';
  import expandService from './expand.service'
  export default {
    name: 'scanDetails',
    data() {
      return{
        imgUrl,
        scannerDialogVisible: false,
        radio: 3,
        scanistor_id: null,
        boxList: [[]],
        activeBoxIndex: 0,
        activeSlideIndex: 0,
        slideStatus:[
          {
            label: '未扫描',
            color: '#CDCDCD',
          },
          {
            label: '预览成功',
            color: '#B620E0',
          },
          {
            label: '扫描中',
            color: '#409EFF',
          },
          {
            label: '已扫描',
            color: '#6DD400',
          },
          {
            label: '无切片',
            color: '#F7B500',
          },
          {
            label: '失败',
            color: '#FA6400',
          },
          {
            label: '未选中',
            color: '#fff',
          }
        ],
        boxChecks: new Array(10).fill(false),
        slideChecks: new Array(40).fill(false),
        scannistor: {},
        timeClear: null,
        isFirst: true,
      }
    },
    methods:{
      activeBox(index){
        this.activeBoxIndex = index;
      },
      activeSlide(index){
        this.activeSlideIndex = index;
      },
      async getScanDetail(isFirst = false){
        this.scanistor_id = this.$route.query.id
        await expandService.getScanDetail({scanistor_id: this.scanistor_id}).then(res=>{
          if( res.body.data.list.length ==0) return false;
          this.boxList = res.body.data.list || [[{status: 1},{status: 2}]];
          this.scannistor = res.body.data.scannistor;
          const boxInit = isFirst ? parseInt(Object.keys(this.boxList).shift()) : this.activeBoxIndex;
          const slideInit =isFirst ? parseInt(Object.keys(this.boxList[boxInit]|| [])?.shift()) : this.activeSlideIndex;
          this.activeBox(boxInit);
          this.activeSlide(slideInit);
          this.$forceUpdate();
        })
      },
      viewSlides(){
        let kfbArr = this.boxList[this.activeBoxIndex][this.activeSlideIndex]?.scanistor_path?.map(item=> item.path) ; // kfbArr ||
        let obj = JSON.stringify( kfbArr ||['hzzt_test/aidikang_all20210223/HSIL/H032.kfb']);
        const { href } = this.$router.resolve({
          name: "viewSlice",
          query: { images: obj }
        });
        window.open(href, '_blank');
      },
    },
    computed: {
      activePercentage(){
        return ((this.scannistor.done/this.scannistor.load)%100).toFixed(2);
      },
    },
    created() {
      const _this = this
      _this.getScanDetail();
      this.timeClear = setInterval(()=>{
        _this.getScanDetail(this.isFirst);
        this.isFirst = false;
        }, 2000)
    },
    beforeDestroy() {
      clearInterval(this.timeClear);
    }
  };
</script>

<style scoped lang="scss">


  .scanner{
    display: flex;
    width:100%;
    height: calc(90vh - 85px);

    ::-webkit-scrollbar{
      display: none;
    }
    .h-overflow{
      height: 104.5%;
      overflow-y: scroll;
    }
    .scanner-left{
      display: flex;
      width: 26%;

      .scanner-box{
        width:90%;
        background-color: #fff;
        padding: 10px 10px 10px 10px;
        position: relative;
        overflow: hidden;

        @keyframes scanning {
          0% {
            left: 0;
            opacity: 0.7;
          }
          90% {
            left: 100%;
            opacity: 0.3;
          }
          100% {
            right: -20px;
            opacity: 0;
          }
        }

        // border: 1px solid #000000;
        .card{
          width: 100%;
          cursor: pointer;
          &:hover{
            border: 1px solid #409EFF;
          }
        }

        .is-active{
          border: 1px solid #409EFF;

        }

/*
 animation: scanning 2s infinite linear;
          &::after{
            content: ' ';
            display: block;
            position: absolute;
            top: 14%;
            width: 30px;
            height: 80%;
            background-image: linear-gradient(to right, transparent 0%, #00ffff 100%);
            z-index: -10;
            animation: scanning 2s infinite linear;
            opacity: 0.7;
          }
*/
        /*.scanner-box-content{*/
        /*  writing-mode:tb-rl;*/
        /*  height: 80px;*/
        /*  text-align: center;*/
        /*}*/
        ::v-deep{
          .el-card__body{
            padding: 10px;
          }
        }
      }
      .scanner-slide1{
        height: 150px;
      }
      .scanner-slide2{
        margin-left: 30px ;
        width: 85%;
        min-width: 395px;
        .dad_img{
          height: 183px;
          margin-left: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

      }
      .scanner-slide{
        padding: 5px;
        background-color: #fff;
        margin:3px 0 0 5px;
        cursor: pointer;
        border: 1px solid #fff;
        &:hover{
          border: 1px solid #409EFF;
        }
      }
      .is-active{
        border: 1px solid #409EFF;
      }
      ::v-deep{
        .el-checkbox__input{
          margin: 0 4px 4px 0;
        }
      }
    }
    .scanner-body{
      width: 63%;
      height: 85vh;
      display: flex;
      align-items: center;
      //margin-right: 20px;
      background: #000000;
      opacity: 0.29;
      .dad_img{
        width: 100%;
        padding: 0 5px 0 5px;
        min-height: 522px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #DFDFDF;
      }
    }
    .scanner-right{
      margin: 5px 0 0 10px ;
      height: 100%;
      min-width: 185px;
      .w-100{
        width: 100px;
      }
      .dad_img{
        width: 100%;
        padding: 0 5px 0 5px;
        min-height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;

      }
      .margin-t-b-5{
        margin: 5px 0 5px 0;
      }
      .margin-t-b-8{
        margin: 8px 0 8px 0;
      }
      .scan-status-list{
        margin: 5px 0 5px 0;
        /*width: 150px;*/
        /*display: flex;*/
        /*flex-wrap: wrap;*/
      }
      .scan-status-box{
        display: flex;
        margin: 2px 0  5px 0;
        font-size: 16px;
        line-height: 16px;
        .scan-status{
          width: 50px;
          height: 16px;
          border-radius: 3px;
          margin:2px 5px 0 5px;
        }
      }

      ::v-deep{
        .el-input__inner{
          background-color: #fff;
          color: #000;
        }
        .el-checkbox{
          padding-top: 5px;
        }
        .el-checkbox__input.is-disabled .el-checkbox__inner{
          border-color: #7c869a;
          margin-top: 3px;
        }
        .el-checkbox__label{
          color: #000;
        }
        .el-form-item__content{
          line-height: 40px;
        }
        .el-form-item {
          margin-bottom: 0;
        }
        .slide{
          .el-select{
            margin-left: 5px;
            width: 110px;
          }
        }
        .plies{
          font-size: 14px;
          margin-left: 5px;
          .el-input{
            margin: 0 8px 0 8px;
            width: 120px;
          }
        }
        .el-radio {
          margin-right: 8px;
        }
        .el-divider{
          margin: 12px 0;
        }
    }
    .success{
      background-color: lightgreen;
    }
    .failure{
      background-color: #F56C6C;
    }
    .no-slice{
      background-color: #E6A23C;
    }
    .scan{
      background-color: #409EFF;
    }
    .info{
      background-color: #909399;
    }
    .is-view{
      background-color: #B620E0;
    }
    .is-check{
      border: 1px #6f6f6f solid;
      border-radius: 2px;
    }
  }
}
  .scanner-tools-box{
    position: fixed;
    background-color: #fff;
    height: 105px;
    z-index: 100;
    width: calc(100% - 210px);
    min-width: 1440px;
    display: flex;
    justify-content: center;
    padding-right: 4%;
    padding-left: 3%;
    bottom: 0;
    border-top: 2px cornflowerblue solid;
    .scanner-tools{
      display: flex;
      height: 110px;
      align-items: center;
      width: 95%;
      .tools-left{
        width: 10%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;
        .ratio{
          width: 120px;
          font-size: 20px;
          text-align: center;
          height: 70px;
          span{
            color: #409EFF;
          }
        }
       }
      .is-de{
        background: #909399 !important;
      }
      .tools-button{
        width: 44px;
        height: 58px;
        font-size: 16px;
        box-sizing: content-box;
        /*line-height: 70px;*/
        cursor: pointer;
        text-align: center;
        vertical-align: center;
        //box-shadow:  3px 3px 3px #f3f3f3;
        //background-color: #409EFF;
        background: rgba(6, 85, 195, 1);
        border: 8px rgba(231, 238, 249, 1) solid;
        //box-shadow: inset 2px 2px 2px  rgb(255 255 255 / 50%), 7px 7px 20px 0 rgb(0 0 0 / 10%), 4px 4px 5px 0 rgb(0 0 0 / 10%);
        color: #fff;
        font-weight: 600;
        border-radius: 50%;
        /*margin: 0 15px 0 15px;*/
      }
      .tools-center{
        flex: 1;
        font-size: 14px;
      }
      .tools-right{
        display: flex;
        width: 17%;
        justify-content: center;
        padding-right: 20px;
      }
    }
  }

</style>
