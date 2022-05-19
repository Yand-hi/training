<template>
  <div class="history main-container">
    <div>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="设备编号">
          <el-input v-model="searchForm.m_id" clearable @keypress.native.enter="getHistory" size="mini" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.name" clearable @keypress.native.enter="getHistory" size="mini" placeholder="请输入设备名称"></el-input>
        </el-form-item>
<!--        <el-form-item label="病理号">-->
<!--          <el-input v-model="searchForm.user" size="mini" placeholder="请输入病理号"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="选择日期">
          <el-date-picker
            clearable
            v-model="searchForm.date"
            size="mini"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getHistory">查询</el-button>
          <el-button type="primary" size="mini" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-table">
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%;">
        <el-table-column
          v-for="(item) of columns"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button size="mini" @click="viewDetails(scope.row)">查看</el-button>
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

  </div>
</template>

<script>
  import historyService from './history.service';
  import {clearObject} from '../../../../config/utils';
export default {
  name: 'History',
  data() {
    return {
      tableData: [],
      columns: [
        {
          label: '序号',
          prop: 'id',
          // slot: ({row})=> {
          //   console.log(row);
          //   return `${row.date+'is'}`
          // }
        },
        {
          label: '设备编号',
          prop: 'm_id',
        },
        {
          label: '设备名称',
          prop: 'name',
        },
        {
          label: '开始时间',
          prop: 'start_time',
        },
        {
          label: '结束时间',
          prop: 'end_time',
        },
        {
          label: '切片总量',
          prop: 'done',
        },
        {
          label: '扫描量',
          prop: 'done',
        },
        {
          label: '成功',
          prop: 'success_count',
        },
        {
          label: '失败',
          prop: 'fail_count',
        },
      ],
      searchForm: {},
      meta: {
        count: 0,
        current_page: 1,
        per_page: 15,
        page: 1,
      },

    }
  },
  methods:{
    getHistory(){
      if(this.searchForm?.date?.length){
        this.searchForm.start_date=this.searchForm.date?.[0];
        this.searchForm.end_date= this.searchForm.date?.[1];
      }
      historyService.getHistory({...this.searchForm,...this.meta}).then(res=>{
        if(res.body.ret_code===0) {
          this.tableData =res.body.data.list;
          this.meta = res.body.data.meta;
        } else{
          this.$message.warning(res.body.ret_msg);
        }
      })
    },
    viewDetails(row){
      this.$router.push({path:'historyDetails',query:{id:row.id}})
    },
    handleSizeChange(val) {
      this.meta.page = val;
      this.getHistory();
    },
    handleCurrentChange(val) {
      this.meta.page = val;
      this.getHistory();
    },
    reset(){
      this.searchForm = clearObject(this.searchForm);
      this.meta = clearObject(this.meta);
      this.getHistory();
    },
  },
  created() {
    this.getHistory()
  }
}
</script>

<style lang="scss" scoped>
.history{
  margin: 15px;
}
</style>
