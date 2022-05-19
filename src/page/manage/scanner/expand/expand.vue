<template>
  <div class="expand main-container">
    <div>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline ">
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.name" clearable @keypress.native.enter="onSubmit" size="mini" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input v-model="searchForm.m_id" clearable @keypress.native.enter="onSubmit" size="mini" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="searchForm.status" clearable size="mini" clearable placeholder="请选择设备状态" clearable>
            <el-option label="空闲" value="0"></el-option>
            <el-option label="忙碌" value="1"></el-option>
            <el-option label="故障" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="reset()">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" size="mini" @click="showAdd">新增仪器</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="flex wrap device" >
      <el-card  class="device-box" v-for="(item,index) of scannerList" :key="index">
        <div class="device-title">
          <div>
            <div :class="item.status === 0 ? 'round success-bg':item.status === 1 ? 'round brand-bg' : 'round danger-bg'"></div>
            <span>{{ item.name+ (item.m_id || '')}}</span>（{{item.status === 0 ? '空闲': item.status === 1 ? '忙碌' : '故障'}}）</div>
        </div>
        <div v-if="item.status === 1">
          <div class="device-box-card-busy">
            <el-image src="../../../../assets/img/KF_PRO_400.png" style="margin: 15px 25px"></el-image>
            <div class="device-info">
              <div class="info-row"><div class="tit">切片总量</div> <div class="tit">已扫描</div></div>
              <div class="info-row"><div class="brand-fc fb">{{ item.account || 0 }}</div> <div class="brand-fc fb">{{ item.done||0 }}</div></div>
              <div class="info-row"><div class="tit">扫描成功</div> <div class="tit">扫描失败</div></div>
              <div class="info-row"><div class="success-fc fb">{{ item.success_count || 0 }}</div> <div class="danger-fc fb">{{ item.fail_count||0 }}</div></div>
            </div>
          </div>
          <div>
            <div class="flex justify-content-between">
              <div>开始时间：{{item.start_time}}</div> <div>剩余时间：{{item.left_time}}</div>
            </div>
            <div>已经用时：{{item.eclipse_time}}</div>
          </div>
          <el-divider></el-divider>
          <div class="flex justify-content-end">
            <el-button @click.stop="viewScanner(item)" type="success" size="mini">扫描配置</el-button>
            <el-button @click.stop="toAdjust(item)" type="primary" size="mini">队列控制</el-button>
          </div>
        </div>
        <div v-else-if="item.status === 0">
          <div class="device-box-card-free">
            <el-image src="../../../../assets/img/KF_PRO_400.png" style="margin: 0 auto"></el-image>
          </div>
        </div>
        <div v-else>
          <div class="device-box-card-free"
               v-loading="loading"
               element-loading-text="仪器故障"
               element-loading-spinner="el-icon-error"
               element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-image src="../../../../assets/img/KF_PRO_400.png" style="margin: 0 auto"></el-image>
          </div>
        </div>
      </el-card>
    </div>

    <el-pagination
      background
      @current-change="pageChange"
      @size-change="getScan"
      layout="total, prev, pager, next, jumper"
      :page-size="meta.per_page"
      :current-page="meta.page"
      :total="meta.count">
    </el-pagination>
    <el-dialog
      title="新增仪器"
      :visible.sync="addDialogVisible"
      width="400px">
      <el-form :model="addForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="设备IP" placeholder="请输入设备IP" required>
          <el-input size="mini" type="text" v-model="addForm.ip"></el-input>
        </el-form-item>
        <el-form-item label="设备编号" placeholder="请输入设备编号" required>
          <el-input size="mini" type="text" v-model="addForm.m_id"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" placeholder="请输入设备名称" required>
          <el-input size="mini" type="text" v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addDialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addScan">添 加</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import expandService from './expand.service'
  import {clearObject} from '../../../../config/utils';
export default {
  name: 'Expand',
  data() {
    return {
      searchForm: {
        m_id: null,
        name: null,
        status: null,
      },
      addDialogVisible: false,
      scannerDialogVisible: true,
      addForm: {},
      scannerList: [],
      meta: {
        count: 0,
        current_page: 1,
        page: 1,
        per_page: 6,
      },
      loading: true,
      tableLoading: true,
      timeClear: null,
    }
  },
  methods: {
    onSubmit(){
      this.getScan();
    },
    getScan() {
      // console.log(this.meta.current_page , 'this.meta.page ');
      // this.meta.page = this.meta.current_page;
      expandService.getScan({...this.searchForm,...this.meta}).then(res=>{
        if(res.body.ret_code===0) {
          this.scannerList =res.body.data.list;
          this.meta = res.body.data.meta;
        } else{
          this.$message.warning(res.body.ret_msg);
        }
      })
    },
    pageChange(val){
      this.meta.page = val;
      this.getScan();
    },
    showAdd() {
      this.addDialogVisible=true;
      this.addForm={}
    },
    addScan() {
      expandService.addScan(this.addForm).then(res=>{
        if(res.body.ret_code===0) {
          this.$message.success('扫描仪添加成功');
          this.getScan();
          this.addDialogVisible = false;
        } else{
          this.$message.warning(res.body.ret_msg);
        }
      })
    },
    viewScanner(item) {
      this.$router.push({ name: "scanDetails",query:{id:item.id}})
    },
    toAdjust(item){
      this.$router.push({ name: "adjustSlice",query:{id:item.id}})
    },
    reset(){
      this.searchForm = clearObject(this.searchForm);
      this.meta = clearObject(this.meta);
      this.meta.per_page = 6;
      this.getScan();
    },
  },
  created() {
    const _this = this;
    _this.getScan();
    this.timeClear =  setInterval(()=>{
      _this.getScan();}, 4000)
  },
  beforeDestroy() {
    clearInterval(this.timeClear);
  }
}
</script>

<style lang="scss" scoped>
  #asideNav{
    display: none;
  }
  .expand{
    margin: 15px;
    .device{
      margin-top: 15px;
      .device-box{
        width: 31%;
        // cursor:pointer;
        // border: 1px solid #6f6f6f;
        padding: 8px 10px 8px 10px;
        margin: 0 0 15px 15px;
        .device-title{
          span{
            font-size: 16px;
            font-weight: bold;
          }
          .round {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 5px;
            margin-right: 3px;
          }
        }
        .device-box-card-busy{
          border-radius: 4px;
          border: 1px solid #EBEEF5;
          background-color: #F5F5F5;
          overflow: hidden;
          color: #303133;
          transition: 0.3s;
          width: 100%;
          margin: 5px auto;
          height: 185px;
          display: flex;
        }
        .device-box-card-free {
          border-radius: 4px;
          border: 1px solid #EBEEF5;
          background-color: #F5F5F5;
          overflow: hidden;
          color: #303133;
          transition: 0.3s;
          width: 100%;
          margin: 5px auto;
          height: 280px;
          display: flex;
          justify-content: center;
          align-items: center;

          ::v-deep {
            .el-loading-spinner .el-loading-text, .el-loading-spinner i {
              color: #FA6400;
            }
          }
        }
        .device-info{
          margin: 20px auto;
          width: 160px;
          .info-row{
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-size: 18px;
          }
          .fb{
            font-weight: bold;
          }

        }
        ::v-deep{
          .el-card__body{
            padding: 10px;
          }
          .el-divider--horizontal{
            margin: 7px 0;
          }
        }
      }

    }

  }

</style>
