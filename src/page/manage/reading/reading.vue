<template>
  <div class="read">
    <div class="read-left" v-if="queryType !=='slice'">
      <div class="title">
        <span>切片数量: {{pathologyInfo.length||0}}</span>
        <el-button type="danger" @click="deleteSlice" size="mini">删除</el-button>
      </div>
      <div style="height: 100%; overflow-y: hidden">
        <template v-for="(item,index) of pathologyInfo">
          <div :class="index===activeIndex?'is-active scanner-slide':'scanner-slide'" :key="index" @click="active(index)" style="width:250px">
            <div style="margin:0 5px 5px 5px;display: flex;justify-content: space-between">
              <div>
                <el-checkbox v-model="item.check">{{item.name}}</el-checkbox>
                <div style="font-size:14px;margin-left:20px">试剂名称： {{item.reagent_name}}</div>
              </div>
              <div style="margin-top: 10px">
                <el-button type="success" size="mini" @click="showBind(index)">修改绑定</el-button>
              </div>
            </div>
            <div class="flex align-items-end">
              <el-image style="width: 250px; margin: 0 5px" :src="imgUrl+item.label_img">
              </el-image>
            </div>
          </div>
        </template>

      </div>
    </div>
    <div class="read-right flex-1">
      <div style="">
        <el-card class="box-card" v-if="queryType !=='slice'">
          <div class="flex justify-content-between">
            <div style="margin-right:30px">病理号:{{pathologyInfo[activeIndex].pathology_id}}</div>
            <div style="margin-right:30px">姓名:{{pathologyInfo[activeIndex].real_name}}</div>
            <div style="margin-right:30px">年龄:{{pathologyInfo[activeIndex].age_str}}</div>
            <div style="margin-right:30px">性别:{{pathologyInfo[activeIndex].gender}}</div>

          </div>
          <div class="flex justify-content-between">
            <div style="margin-right:30px">蜡块名称:{{getParaffinBlocks}}</div>
            <div style="margin-right:30px">检查项目:{{pathologyInfo[activeIndex].library_name}}</div>
            <div style="margin-right:30px">诊断意见:{{pathologyInfo[activeIndex].diagnose_advice}}</div>
          </div>
        </el-card>
        <el-card class="box-card" v-if="queryType ==='slice'">
          <div class="flex justify-content-between">
            <div style="margin-right:30px">切片名称:{{pathologyInfo[activeIndex].name}}</div>
            <div style="margin-right:30px">开始时间:{{pathologyInfo[activeIndex].scan_start_at}}</div>
            <div style="margin-right:30px">结束时间:{{pathologyInfo[activeIndex].scan_end_at}}</div>
          </div>
        </el-card>

      </div>
      <div style="width: 100%;height: 80vh;">
        <pis-slide-view :file-name-list='imgList'></pis-slide-view>
      </div>
    </div>
    <el-dialog title="修改绑定" :visible.sync="dialogVisible" width="400px">
      {{imgUrl+pathologyInfo[activeIndex].label_img}}???
      <div class="column flex justify-content-center align-items-center">

        <img :src="imgUrl+pathologyInfo[activeIndex].label_img" alt="" width="180px" style="margin:10px auto">
      </div>
      <el-form ref="form" label-width="80px">
        <el-form-item label="病理号">
          <el-input size="mini" v-model="pathologyId" placeholder="请输入病理号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="liceBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import readingService from './reading.service'
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import {imgUrl} from '@/config/utils';
export default {
  name: 'reading',
  components: { pisSlideView },
  data() {
    return {
      imgUrl,
      imgList: [],
      queryInfo: {},
      queryType: {},
      pathologyInfo: [],
      activeIndex: 0,
      dialogVisible: false,
      eidtIndex: 0,
      pathologyId: null,
    }
  },
  // watch:{
  //   '$route.query':{
  //     handler(val){
  //       this.queryInfo  = JSON.parse(val || "");
  //     },
  //     immediate:true,
  //   }
  // },
  computed: {
    getParaffinBlocks() {
      return this.pathologyInfo?.[this.activeIndex]?.paraffin_blocks?.map(item => item?.sample_name)?.toString()
    },
  },
  methods: {
    getImage() {
      this.queryInfo = JSON.parse(this.$route.query.row || "");
      this.queryType = this.queryInfo.type
      // ...images

    },
    sliceList() {
      let row = JSON.parse(this.$route.query.row || "");
      console.log(row)
      if (row.type === 'slice') {
        console.log(row.id)
        readingService.sliceList({ id: row.id, bind_status: 0 }).then(res => {
          if (res.body.ret_code === 0) {
            this.pathologyInfo = res.body.data.list.map(item => {
              return {
                ...item,
                reagent_name: item.slice_type?.name,
                label_img: `/api/process/get_image?file=${item?.path_list?.[0]?.path}&type=preview`,
                check: false
              }
            });
            console.log(this.pathologyInfo)
            this.imgList = this.pathologyInfo[0]?.path_list?.map(item => item.path);
          } else {
            this.$message.warning(res.body.ret_msg);
          }
        })

      } else {
        readingService.sliceList({ pathology_id: row.pathology_id }).then(res => {
          if (res.body.ret_code === 0) {
            this.pathologyInfo = res.body.data.list.map(item => {
              return {
                ...item,
                reagent_name: item.slice_type?.name,
                label_img: `/api/process/get_image?file=${item?.path_list?.[0]?.path}&type=preview`,
                check: false
              }
            });
            console.log(this.pathologyInfo)
            this.imgList = this.pathologyInfo[0]?.path_list?.map(item => item.path);
            console.log(this.imgList)
          } else {
            this.$message.warning(res.body.ret_msg);
          }
        })

      }
    },
    showBind(index) {
      this.dialogVisible = true;
      this.pathologyId = '';
      this.eidtIndex = index;
    },
    liceBind() {
      let index = this.eidtIndex;
      readingService.sliceBind({ id: this.pathologyInfo[index].id, pathology_id: this.pathologyId }).then(res => {
        if (res.body.ret_code === 0) {
          this.$message.success('修改成功');
          this.sliceList();
          this.dialogVisible = false;
        } else {
          this.$message.warning(res.body.ret_msg);
        }

      })
    },
    deleteSlice() {
      let ids = this.pathologyInfo.filter(item => item?.check).map(item => item.id).toString();
      console.log('ids', ids);
      this.$confirm('是否删除该切片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        readingService.deleteSlice({ id: ids }).then(res => {
          if (res.body.ret_code === 0) {
            this.$message.success('删除成功');
            this.sliceList();
            this.dialogVisible = false;
          } else {
            this.$message.warning(res.body.ret_msg);
          }
        })
      })
    },
    active(index) {
      this.activeIndex = index;
      this.imgList = this.pathologyInfo[index]?.path_list?.map(item => item.path);
      this.$forceUpdate();
    },
  },
  created() {
    this.getImage();
    this.sliceList();
  }
};
</script>

<style scoped lang="scss">
.read {
  display: flex;
  width: 100%;
  height: 100%;
  .read-left {
    // width: 20%;
    height: calc(100% - 30px);
    padding: 15px;
    .scanner-slide {
      padding: 5px 5px 5px 5px;
      background-color: #fff;
      margin: 4px;
      cursor: pointer;
      border: 1px solid #fff;
      &:hover {
        border: 1px solid #409eff;
      }
    }
    .is-active {
      border: 1px solid #409eff;
    }
  }
  .read-right {
    width: calc(100% - 300px);
    height: calc(100% - 30px);
    padding: 15px;
    .box-card {
      padding: 15px;
    }
  }
}
.el-button--mini {
  padding: 5px 7px;
}
</style>
