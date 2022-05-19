<template>
    <div class="adjust">
      <div class="bgc-fff">
        <hzzt-title :label="'扫描顺序'"></hzzt-title>
        <div class="flex wrap">
          <div v-for="(item,index) in boxList"
               @click="getBoxInfo(item, index)"
               v-dragging="{item:item, list:boxList, group:'drag'}"
               :class="boxIndex == index ? 'adjust-box active-adjust-box':'adjust-box'"
               :key="index"
          >
            <div class="text-center text-font"><span>{{index+1}}</span></div>
            <div class="text-content">
              <div class="flex wrap justify-content-center">
                <div v-for="i in 8" :key="i" style="width: 35px;height: 12px;background: rgba(6, 85, 195, 0.3);margin:5px 0 2px 5px"></div>
              </div>
              <div style="width: 100%;height: 1px;background-color: #0655C3; option:0.3"></div>
              <span>第{{item[0].box_id || '异常'}}盒</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bgc-fff" style="margin-top: 20px">
        <div class="flex align-items-center" >
          <hzzt-title :label="'玻片盒详情'"></hzzt-title>
          <div style="margin: 0 20px 0 20px">第{{slideList[0].box_id || '异常'}}盒</div>
          <el-button size="mini" type="primary" @click="getCheck">提前</el-button>
        </div>
        <el-card class="box-card box-border">
          <div class="flex wrap">
             <div style="display: flex;flex-direction: column; height: 250px; flex-wrap: wrap">
               <el-checkbox
                 v-for="(item,i) in slideList" :key="item.index"
                 :class="(i+1)%5===0 ? 'm-b-20 che' : 'che'"
                 v-model="item.ischeck"
                 :true-label="'1'"
                 :false-label="'0'"
                 >
                 {{item.index + ' ' + item.slice_no}}
               </el-checkbox>
             </div>
          </div>

        </el-card>
      </div>

      <div class="bgc-fff" style="margin-top: 20px;padding-bottom: 15px">
        <hzzt-title :label="'优先队列'"></hzzt-title>
        <el-card class="box-card" style="min-height: 50px">
          <el-tag
            style="margin: 5px;"
            v-for="(p,index) of priorityList"
            :key="p.id"
            @close="handleClose(index)"
            closable >
            {{p.index + ' ' + p.slice_no}}
          </el-tag>
        </el-card>
      </div>
      <div class="flex justify-content-center" style="margin-top: 10px">
        <el-button size="medium" type="primary" @click="dialogVisible = true">保存</el-button>
        <el-button size="medium" type="info">取消</el-button>
      </div>
<!--      <draggable group="people" @start="drag=true" @end="drag=false" v-model="colors" class="flex wrap">-->
<!--        <div v-for="item in colors"-->
<!--             :style="'width: 150px;margin: 20px 20px 0 20px ;height: 550px;background-color: '+item.text"-->
<!--             :key="item.text"-->
<!--        >-->
<!--          {{item.text}}-->
<!--        </div>-->
<!--      </draggable>-->

      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="400px"
        >
        <div>
          您确定将：
          <el-tag
          v-for="(p,index) of priorityList"
          :key="p.id">
          {{p.index + ' ' + p.slice_no}}
        </el-tag>提前扫描？
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="advanceScan">提前扫描</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
  import hzztTitle from '../../../../components/hzztTitle';
  import draggable from 'vuedraggable'
  import expandService from './expand.service';
  export default {
    name: 'test',
    data() {
      return {
        scanistor_id: null,
        priorityList: [],
        boxList: [],
        boxIndex: 0,
        slideList: [[]],
        dialogVisible: false,
      }
    },
    components: {draggable,hzztTitle},
    mounted () {
      this.getScanDetail();
      this.$dragging.$on('dragged', ({ value }) => {
        console.log(value.item)
        console.log(value.list)
      })
    },
    methods:{
       getScanDetail(isFirst = false){
        this.scanistor_id = this.$route.query.id;
         expandService.getScanDetail({scanistor_id: this.scanistor_id}).then(res=>{
          this.boxList = res.body.data.list;
          this.slideList = this.boxList?.[0] || [[]];
        })
      },
      getBoxInfo(item, index){
         this.boxIndex =index;
         this.slideList = item;
      },
      getCheck() {
        this.priorityList = [...new Set([...this.priorityList, ...this.slideList.filter(item=>item.ischeck==='1')])];
         console.log(this.priorityList);
      },
      handleClose(index) {
        this.priorityList.splice(index, 1);
      },
      advanceScan() {
        this.dialogVisible = false;
        this.$router.push('/scanner/expand')
      }
    }
  };
</script>

<style scoped lang="scss">
.adjust{
  margin: 15px;
  .bgc-fff{
    background-color: #ffffff;
  }
  .el-card__body {
    padding: 20px !important;
  }
  .hzzt-title{
    padding: 10px 0 10px 0;
  }
  .active-adjust-box{
    border: 2px #0655C3 solid !important;
  }
  .adjust-box{
    color:#0655C3;
    width: 7%;
    margin: 12px;
    padding: 8px 10px 8px 10px;
    background-color: #f3f3f3;
    border-radius: 8px;
    cursor: pointer;
    border: 2px rgba(6, 85, 195, 0.4) dashed ;
    .text-font{
      font-size: 24px;
      font-family: AlibabaPuHuiTiH;
      color: #9CBBE7;
    }
    .text-content{
      width: 88%;
      margin:0 auto;
      border: 3px rgba(6, 85, 195, 0.5) solid;
      border-radius: 10px;
      text-align: center;
    }

  }
  .m-b-20{
    margin-bottom: 20px !important;
  }
  .che{
    width: 120px;
    margin-right: 150px;
  }

}
</style>
