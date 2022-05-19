<template>
  <div class="historyDetails main-container">
    <div>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="切片号">
          <el-input v-model="searchForm.slice_no" clearable @keypress.native.enter="getScanSlice" size="mini" placeholder="请输入切片号"></el-input>
        </el-form-item>
<!--        <el-form-item label="姓名">-->
<!--          <el-input v-model="searchForm.user" size="mini" placeholder="姓名"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="切片类型">
          <el-select v-model="searchForm.slice_type" clearable size="mini" placeholder="切片类型">
            <el-option v-for="(item,index) in slideType" :value="index" :label="item"></el-option>
<!--            <el-option value="1" label="IHC"></el-option>-->
<!--            <el-option value="2" label="Cell"></el-option>-->
<!--            <el-option value="3" label="Others"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getScanSlice">查询</el-button>
          <el-button type="primary" size="mini" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <template
          v-for="(item,index) of columns"
        >
          <el-table-column
            v-if="item.hasOwnProperty('slot')"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          >
            <template slot-scope="scope">
              <viewer :images="[imgUrl+scope.row.slice_label]">
                <div v-html="item.slot(scope)"></div>
              </viewer>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            align="center"
          >
          </el-table-column>
        </template>

        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :hit="false" size="mini" effect="dark" :color="slideStatus[scope.row.status].color">{{slideStatus[scope.row.status].label}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="viewInfo(scope.row)">查看</el-button>
            <el-button size="mini" type="success" :disabled="![1,3].includes(scope.row.status)" @click="viewSlice(scope.row)">浏览</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <!--sizes-->
    <el-pagination
      background
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, prev, pager, next, jumper"
      :page-size="meta.per_page"
      :current-page="meta.page"
      :total="meta.count">
    </el-pagination>

    <el-dialog
      title="查看详情"
      :visible.sync="detailsDialogVisible"
      width="800px">
      <el-card >
       <div class="flex justify-content-between">
         <div>切片号：{{info.slice_no}}</div> <div>切片类型：{{ info.slice_type_txt || slideType[info.slice_type]}}</div>
         <div>开始时间：{{info.created_at}}</div> <div>结束时间：{{info.end_at}}</div>
       </div>
      </el-card>
      <el-image :src="imgUrl+info.slice_preview" style="width: 100%; margin: 15px auto"></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="detailsDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import historyService from './history.service';
  import {clearObject} from '../../../../config/utils';
  import {imgUrl} from '@/config/utils';
  export default {
    name: 'historyDetails',
    data() {
      return {
        imgUrl,
        tableData: [],
        columns: [
          {
            label: '序号',
            prop: 'index',
          },
          {
            label: '切片号',
            prop: 'slice_no',
          },
          {
            label: '切片标签图',
            prop: 'slice_label',
            slot: ({row})=>{
              return `<div>${row.slice_label ? `<img style="width: 80px" src=${this.imgUrl}${row.slice_label}>` : ''}</div>`
            }
          },
          {
            label: '切片类型',
            prop: 'slice_type_txt',
          },
          {
            label: '开始时间',
            prop: 'start_at',
          },
          {
            label: '结束时间',
            prop: 'end_at',
          },
        ],
        slideStatus:[
          {
            label: '未扫描',
            color: '#909399',
          },
          {
            label: '预览成功',
            color: 'darkviolet',
          },
          {
            label: '扫描中',
            color: '#409EFF',
          },
          {
            label: '已扫描',
            color: 'lightgreen',
          },
          {
            label: '无切片',
            color: '#E6A23C',
          },
          {
            label: '失败',
            color: '#F56C6C',
          },

        ],
        searchForm: {},
        scanistor_id: 1,
        slideType: ['HE切片', '免疫组化', '细胞', '其它'],
        detailsDialogVisible: false,
        meta: {
          count: 0,
          current_page: 1,
          per_page: 10,
          page:1,
        },
        info: {},
      }
    },
    methods:{
      getScanSlice() {
        this.scanistor_id = this.$route.query.id
        if(this.searchForm.slice_type==='')  delete this.searchForm.slice_type;
        historyService.getScanSlice({scanistor_id: this.scanistor_id,...this.searchForm,...this.meta}).then(res=>{
          if(res.body.ret_code===0) {
            this.tableData =res.body.data.list // .map(item=>{ return{...item , slice_type : this.slideType[item.slice_type]}});
            this.meta = res.body.data.meta;
          } else{
            this.$message.warning(res.body.ret_msg);
          }
        })
      },
      viewInfo(row) {
        this.info = row ;
        this.detailsDialogVisible = true;
      },
      viewSlice(row) {
        let kfbArr = row?.scanistor_path.map(item=>item.path) ; // kfbArr ||
        let obj = JSON.stringify( kfbArr ||['hzzt_test/aidikang_all20210223/HSIL/H032.kfb']);
        const { href } = this.$router.resolve({
          name: "viewSlice",
          query: { images: obj }
        });
        window.open(href, '_blank');
      },
      handleSizeChange(val) {
        this.meta.page = val;
        this.getScanSlice();
      },
      handleCurrentChange(val) {
        this.meta.page = val;
        this.getScanSlice();
      },
      reset(){
        this.searchForm = clearObject(this.searchForm);
        this.meta = clearObject(this.meta);
        this.meta.per_page = 10;
        this.searchForm.slice_type ='';
        this.getScanSlice();
      },
    },
    created() {
      this.getScanSlice()
    },
  }
</script>

<style lang="scss" scoped>
  .historyDetails{
    margin: 15px;
  }
  .el-tag--dark {
    border-width: 0;
    color: #fff;
  }
</style>


