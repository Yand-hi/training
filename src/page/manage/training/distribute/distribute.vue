<template>
  <div class="main-container entry-main">
    <div class="common-header">
      <div class="flex align-items-center" style='position: relative;width:100%'>
        <el-input style="margin-right: 12px" v-model="name" size="mini" clearable placeholder="请输入切片名称" suffix-icon="el-icon-search" v-on:keyup.enter.native="sliceList()"></el-input>
        <el-input style="margin-right: 12px" v-model="pathology_id" size="mini" clearable placeholder="请输入病理号" suffix-icon="el-icon-search" v-on:keyup.enter.native="sliceList()"></el-input>
        <el-input style="margin-right: 12px" v-model="real_name" size="mini" clearable placeholder="请输入姓名" suffix-icon="el-icon-search" v-on:keyup.enter.native="sliceList()"></el-input>
        <el-select style="margin-right: 12px" v-model="slice_type_id" size="mini" placeholder="请选择切片分类" clearable @change="sliceList()">
          <el-option v-for="type in slice_type_list" :label="type.name" :value="type.id" :key="type.id"></el-option>
        </el-select>
        <el-select style="margin-right: 12px" v-model="is_assign" size="mini" placeholder="请选择分配状态" clearable @change="sliceList()">
          <el-option label="未分配" :value="0"></el-option>
          <el-option label="已分配" :value="1"></el-option>
        </el-select>

        <div  style='position: absolute;right:10px;top:0;'>
          <el-button size="mini" type="primary" @click="clearValue()">重置</el-button>
          <el-button size="mini" type="success" @click="showDistribute">数据分配</el-button>
        </div>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table v-loading="tableLoading" ref="data" :row-style="{height:'20px'}" :cell-style="{padding:'0px'}" :data="data" @selection-change="handleSelect" border :height='tableHeight' style="width: 100%" :header-cell-style="headerCellStyle" @row-click="selectRow" :row-class-name="rowClassName">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column align="center" type="index" label="序号" width="45" :index="indexMethod"></el-table-column>
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
          </el-table-column>
          <el-table-column align="center" prop="distribute_path" label="分配目录" min-width="80px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.folder" :key="item.id">
                {{item.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="is_assign" label="状态" min-width="80px">
            <template slot-scope="scope">
              <span style="color:#F56C6C" v-if="scope.row.is_assign === 0">● 未分配</span>
              <span style="color:#67C23A" v-if="scope.row.is_assign === 1">● 已分配</span>
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="80px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="text" size="mini" @click="reMark(scope.row)">重标</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination
            @current-change="handleCurrentChange" 
            @size-change="sliceList()"
            :current-page.sync="meta.current_page" 
            :page-size="meta.per_page" 
            layout="total ,prev, pager, next, jumper" 
            :total="meta.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog width="600px" title="数据分配" :visible.sync="distributeDialogVisible">
      <span style="color:#0655C3">提示 ：选择分配总量{{multipleSelection.length}}个</span>
      <el-form label-width="90px" :model="distributeForm">
        <el-row>
          <el-col :span="12" style="padding:0">
            <el-form-item label="训练集名称:" prop="train_folder_ids" :validate-on-rule-change="false">

              <el-select v-model="distributeForm.train_folder_ids" placeholder="请选择训练集" @change="getInfo('1', $event)" size="mini" style="width: 100%;">
                <el-option v-for="train in trainFolder" :key="train.id" :value="train.id" :label="train.name">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding:0">
            <el-form-item label="数量:" prop="train_count" style="" :validate-on-rule-change="false"> 
              <el-input-number v-model="distributeForm.train_count" controls-position="right" size="mini" placeholder="请输入分配数量" @change="handleCount1" :min="0" :max="trainCount"></el-input-number>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <span style="line-height:40px">
            训练集概况：
          </span>
          <el-card class="allocation-card" shadow="hover" v-show="showTrainInfo">
            <div slot="header" class="column flex justify-content-between align-items-start">
              <div class="" v-for="item in trainFolderInfo" :key="item.id">
                <span>{{item.folder_name}} &nbsp;&nbsp;&nbsp;
                  1.切片总数量: &nbsp;{{item.slice_count}} &nbsp;&nbsp;&nbsp;
                  2.ROI框数量: &nbsp;{{item.roi}}&nbsp;&nbsp;&nbsp;
                  3.细胞分类统计：&nbsp;
                  <span v-for="(cell,index) of item.cate" :key="index">
                    {{cell.label_type_name}} :&nbsp;{{cell.total}}&nbsp;&nbsp;&nbsp;
                  </span>
                </span>
              </div>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-col :span="12" style="padding:0">
            <el-form-item label="测试集名称:" prop="test_folder_ids" style="" :validate-on-rule-change="false">

              <el-select v-model="distributeForm.test_folder_ids" placeholder="请选择测试集"  @change="getInfo('2', $event)" size="mini" style="width: 100%;">
                <el-option v-for="test in testFolder" :key="test.id" :value="test.id" :label="test.name">
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding:0">
            <el-form-item label="数量:" prop="test_count" style="" :validate-on-rule-change="false">

              <el-input-number v-model="distributeForm.test_count" controls-position="right" size="mini" placeholder="请输入分配数量" @change="handleCount2" :min="0" :max="testCount"></el-input-number>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <span style="line-height:40px">
            测试集概况：
          </span>
          <el-card class="allocation-card" shadow="hover" v-show="showTestInfo">
            <div slot="header" class="column flex justify-content-between align-items-start">
              <div class="" v-for="item in testFolderInfo" :key="item.id">
                <span>{{item.folder_name}} &nbsp;&nbsp;&nbsp;
                  1.切片总数量: &nbsp;{{item.slice_count}} &nbsp;&nbsp;&nbsp;
                  2.ROI框数量: &nbsp;{{item.roi}}&nbsp;&nbsp;&nbsp;
                  3.细胞分类统计：&nbsp;
                  <span v-for="(cell,index) of item.cate" :key="index">
                    {{cell.label_type_name}} :&nbsp;{{cell.total}}&nbsp;&nbsp;&nbsp;
                  </span>
                </span>
              </div>
            </div>
          </el-card>

        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="distributeDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="distribute()">分配</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { distributeService } from '@/page/manage/training/distribute/distribute.service';
import { mapState } from 'vuex';


export default {
  components: {
    hzztTitle,
    pisSlideView,
  },
  data() {
    return {
      cate_id: undefined,
      data: [],
      filterText: '',
      headers: [ {
          'prop': 'name',
          'label': '切片名称',
          'min-width': 140,
          'align': 'center',
        }, 
          {
          'prop': 'pathology_id',
          'label': '病理号',
          'min-width': 110,
          'align': 'center',
        }, {
          'prop': 'real_name',
          'label': '姓名',
          'min-width': 85,
          'align': 'center',
        }, 
        {
          'prop': 'diagnose',
          'label': '诊断类型',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'diagnose_advice',
          'label': '诊断意见',
          'min-width': 200,
          'align': 'center',
        }, {
          'prop': 'roi_count',
          'label': 'ROI框数量',
          'min-width': 85,
          'align': 'center',
        }, {
          'prop': 'label_count',
          'label': '标注数量',
          'min-width': 85,
          'align': 'center',
        }, {
          'prop': 'slice_type',
          'label': '切片类型',
          'min-width': 85,
          'align': 'center',
        },
      ],
      pathology_id: '',
      is_assign: '',
      slice_type_id: '',
      name: '',
      real_name: '',
      slice_folder_type: '',
      label_status: '',
      loading: false,
      showTrainInfo: false,
      showTestInfo: false,
      multipleSelection: [],
      slice_type_list: [],
      pagination: { count: 0, current_page: 1, per_page: 15 },
      tableHeight: '100%',
      tableLoading: false,
      label_status: undefined,
      status: undefined,
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
      users: [],
      distributeForm: {},
      distributeDialogVisible: false,
      testFolder: [],
      trainFolder: [],
      meta: {
        count: 0,
        current_page: 1,
        per_page: 25,
      },
      trainFolderInfo: [],
      testFolderInfo: [],
      trainCount:Number,
      testCount:Number,
    };
  },
  mounted() {

  },
  computed: {
    ...mapState(['user']),
  

  },
  watch: {
    selectData(data) {
      this.selectRow = []
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.data.indexOf(item))
        })
      }
    }
  },
  created() {
    this.sliceList();
    this.folderList();
    this.getType();
  },
  methods: {
    //病理号
    getType() {
      distributeService.sliceType({ type: 1 }).then(({ body }) => {
        if (body.ret_code === 0) {
          this.slice_type_list = body.data.list
        }
      })
    },
    //切片列表
    sliceList() {
      let params = {
        ...this.meta,
        pathology_id: this.pathology_id,
        is_assign: this.is_assign,
        slice_type_id: this.slice_type_id,
        name: this.name,
        real_name: this.real_name,
        slice_folder_type: this.slice_folder_type,
        label_status: this.label_status,
        folder_id: this.folder_id,
      };
      this.tableLoading = true;
      distributeService.sliceList(params).then(({ body }) => {
        this.data = [];
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
           slice_type: item.slice_type?.name
          }))
          this.meta = body.data.meta;
        }
      }).catch(() => {
        this.meta = { count: 0, current_page: 1, per_page: 25};
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    //目录列表
    folderList() {
      let params = {
        type: 1
      }
      distributeService.folderList(params).then(({ body }) => {
        this.trainFolder = {};
        if (body?.ret_code === 0) {
          this.trainFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      }).catch(() => {

      }).finally(() => {

      });
      distributeService.folderList({ type: 2 }).then(({ body }) => {
        this.testFolder = [];
        if (body?.ret_code === 0) {
          this.testFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      }).catch(() => {

      }).finally(() => {

      });
    },

    //分页页码改变事件
    handleCurrentChange(val) {
      this.meta.page = val;
      console.log(val)
      this.sliceList();
    },

    selectRow(row) {
      this.$refs.data.toggleRowSelection(row)
    },

    // 重置
    clearValue() {
      this.is_assign = undefined
      this.slice_type_id = undefined
      this.name = undefined
      this.real_name = undefined
      this.slice_folder_type = undefined
      this.label_status = undefined
      this.folder_id = undefined
      this.sliceList();
    },

    // 多选
    handleSelect(list) {
      this.selectData = list
      this.multipleSelection = list.concat();
      this.slice_id = Array.prototype.concat.apply([], (this.multipleSelection).map(d => d.id))

    },
    
    showDistribute(){
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择需要分配的数据');
        return;
      }else{
          this.distributeDialogVisible = true
          this.trainCount = this.multipleSelection.length
          this.testCount = this.multipleSelection.length
      }

    },
    distribute() {
      const params = {
        slice_ids: (this.slice_id).toString(),
        train_folder_ids: (this.distributeForm.train_folder_ids).toString(),
        train_count: (this.distributeForm.train_count).toString(),
        test_folder_ids: (this.distributeForm.test_folder_ids).toString(),
        test_count: (this.distributeForm.test_count).toString(),
      }
      distributeService.distributeSlice(params).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.$message.success('分配成功');
          this.distributeDialogVisible = false
          this.sliceList();
        } else {
          this.$message.error(body?.ret_msg || '分配失败');
        }
      })
    },
     getInfo(type, $event) {
      console.log($event)
      if ($event.length === 0) {
        this.showTrainInfo = false
        this.showTestInfo = false
      } else if (type === '1') {
        this.showTrainInfo = true
        distributeService.getFolderInfo({ ids: ($event).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            this.trainFolderInfo = body.data.list
          }
        })
      } else if (type === '2') {
        this.showTestInfo = true
        distributeService.getFolderInfo({ ids: ($event).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            this.testFolderInfo = body.data.list
          }
        })

      }
    },
    handleCount1(value) {
      console.log(value);
      this.testCount = this.multipleSelection.length - value
      this.distributeForm.test_count = this.multipleSelection.length - value

    },
    handleCount2(value) {
      console.log(value);
      this.trainCount = this.multipleSelection.length - value
      this.distributeForm.train_count = this.multipleSelection.length - value
    },

    // 重新标注
    reMark() { },


    indexMethod(index) {
      return index + 1;
    },
    headerCellStyle({ row, rowIndex }) {
      return 'background-color: #D3E1F4;text-align: center; padding:0;height:30px;color:#666'
    },
    cellStyle({ row, rowIndex }) {
      return 'text-align: center;text-align: center; padding:0;height:30px'
    },
    rowClassName({ row }) {
      console.log(this.slice_id)
      if (this.slice_id) {
        var arr = this.slice_id
        for (let i = 0; i < arr.length; i++) {
          if (row.id === arr[i]) {
            return 'warning-row ';
          }
        }
      }
    },

  },
  watch: {
    filterText(val) {
      this.$refs.entryTree.filter(val);
    },
  },
};
</script>

<style lang="scss">

  .el-card__body {
    padding: 0 !important;
  }
  .el-table__row.warning-row {
    background-color: #b4cced;
  }
  .el-table__row.current-row.warning-row {
    background-color: #b4cced;
  }

</style>
