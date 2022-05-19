<template>
  <div class="main-container entry-main">
    <div class="common-header">
      <div class="flex align-items-center " style='position: relative;width:100%'>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="">
            <el-input clearable size="mini" @keypress.native.enter="onSubmit" v-model="searchForm.name" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable size="mini" v-model="searchForm.model_type_id" placeholder="请选择模型类型">
              <el-option v-for="type in modelTypeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable size="mini" v-model="searchForm.model_name" placeholder="请选择模型名称">
              <el-option v-for="(item,index) in modelNameList" :label="item.model_name" :value="item.model_name" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable size="mini" v-model="searchForm.train_folder_ids" placeholder="请选择训练集">
              <el-option v-for="train in trainFolder" :label="train.name" :value="train.id" :key="train.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select clearable size="mini" v-model="searchForm.test_folder_ids" placeholder="请选择测试集">
              <el-option v-for="test in testFolder" :label="test.name" :value="test.id" :key="test.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style='position: absolute;right:0;top:0;'>
            <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
            <el-button size="mini" type="primary" @click="clearValue()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table :row-style="{height:'20px'}" :cell-style="{padding:'0px'}" stripe v-loading="tableLoading" :data="data" border :height='tableHeight' style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="80px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="danger" size="mini" @click="evaluateTask(scope.row)">评估</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="slicePage" style="position: absolute;bottom: 0; width:100%;
        display: flex;justify-content:center ;height: 40px;align-items:flex-start">
          <el-pagination @current-change="handleCurrentChange" :current-page.sync="pagination.current_page" :page-size="pagination.per_page" layout="total ,prev, pager, next, jumper" :total="pagination.count">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog width="400px" title="评估" :visible.sync="evaluateVisible" v-if="evaluateVisible" class="evaluate-dialog">
      <el-form label-width="82px" :model="evaluateForm" ref="evaluateForm">
        <el-row :span="24" class="flex">
          <el-col :span="24" style="padding:0">
            <el-form-item label="评估指标:">
              <span> {{evaluate_name}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row><br> </el-row>
        <el-row :span="24" class="flex">
          <el-col :span="24" style="padding:0">
            <el-form-item label="评估记录:" prop="remark" :rules="{
                required: true, message: '评估记录不能为空', trigger: 'blur'}">
              <el-input :autosize="{ minRows: 2}" type="textarea" v-model="evaluateForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row><br> </el-row>
        <el-row :span="24" class="flex">
          <el-col :span="24" style="padding:0">
            <el-form-item label="">
              <el-button type="danger" size="mini" @click="evaluateVisible = false">取 消</el-button>
              <el-button type="primary" size="mini" @click="commitEvaluate">确定</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <el-divider></el-divider>
      <div class="column flex justify-content-between align-items-start">
        <div style="margin-bottom:5px;font-size:14px"> 历史评估记录
        </div>
        <div class="" v-for="(item,index) in evaluate_history" :key="item.id" style="font-size:13px">
          <span>{{index+1}}:{{item.remark}} &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { taskService } from '@/page/manage/training/task/task.service';
import { estimateService } from '@/page/manage/training/estimate/estimate.service';
import { mapState, createNamespacedHelpers } from 'vuex';


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
      headers: [
        {
          'prop': 'name',
          'label': '任务名称',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'model_type',
          'label': '模型类型',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'model_name',
          'label': '模型名称',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'train_folder',
          'label': '训练集名称',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'test_folder',
          'label': '测试集名称',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'test_folder',
          'label': '参数',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'created_at',
          'label': '创建时间',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'evalute_index',
          'label': '评估指标',
          'min-width': 100,
          'align': 'center',
        },
      ],
      pathology_id: '',
      is_assign: '',
      slice_type_id: '',
      name: '',
      real_name: '',
      slice_folder_type: '',
      loading: false,
      evaluateVisible: false,
      multipleSelection: [],
      modelTypeList: [],
      modelNameList: [],
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
      searchForm: {},
      evaluateForm: {},
      testFolder: [],
      trainFolder: [],
      evaluate_info: [],
      evaluate_name: '',
      evaluate_id: '',
      evaluate_history: []
    };
  },
  mounted() {

  },
  computed: {
    ...mapState(['user']),

  },
  created() {
    this.taskList();
    this.folderList();
    this.getSelection();
  },
  methods: {
    //获得下拉框列表
    getSelection() {
      taskService.getModelName().then(res => {
        this.modelNameList = res.body.data
      }).catch(() => {
      });
      taskService.getModelType().then(res => {
        this.modelTypeList = res.body.data.list
      }).catch(() => {
      });
      taskService.folderList({ type: 1 }).then(({ body }) => {
        this.trainFolder = {};
        if (body?.ret_code === 0) {
          this.trainFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      });
      taskService.folderList({ type: 2 }).then(({ body }) => {
        this.testFolder = [];
        if (body?.ret_code === 0) {
          this.testFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      });
    },
    // 初始化切片列表
    taskList() {
      let params = {
        status: '2',
      };
      this.tableLoading = true;
      taskService.taskList(params).then(({ body }) => {
        // console.log(body.data.list)
        this.data = [];
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
            pathology_type: item.slice_type.name,
            model_type: item.model_type.name,
            train_folder: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.train_folder).map(d => d))).map(d => d.name)),
            test_folder: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.test_folder).map(d => d))).map(d => d.name)),
            evalute_index: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.evalute_index).map(d => d))).map(d => d.name)),
            // slice_type: item.slice_type.name
          }))
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    onSubmit() {
      const params = {
        name: this.searchForm.name,
        model_type_id: this.searchForm.model_type_id,
        model_name: this.searchForm.model_name,
        train_folder_ids: this.searchForm.train_folder_ids,
        test_folder_ids: this.searchForm.test_folder_ids,
        status: '2',
      }
      taskService.taskList(params).then(({ body }) => {
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
            distribute_path: Array.prototype.concat.apply([], (Array.prototype.concat.apply([], (item.folder).map(d => d))).map(d => d.name)),
            slice_type: item.slice_type.name
          }))
          this.pagination = body.data.meta;
        }
      }).catch(() => {
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });

    },
    clearValue() {
      this.searchForm.name = undefined
      this.searchForm.pathology_id = undefined
      this.searchForm.real_name = undefined
      this.searchForm.slice_type = undefined
      this.onSubmit()
    },

    folderList() {
      let params = {
        type: 1
      }
      taskService.folderList(params).then(({ body }) => {
        this.trainFolder = {};
        if (body?.ret_code === 0) {
          this.trainFolder = (body.data.list).map((item) => ({
            ...item,
          }))
        }
      }).catch(() => {

      }).finally(() => {

      });
      taskService.folderList({ type: 2 }).then(({ body }) => {
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
      this.sliceTable();
    },

    newTask() {
      this.$router.replace('task/add')
    },
    evaluateTask(val) {
      estimateService.getEvaluateHistory({ task_id: val.id }).then(({ body }) => {
        if (body.ret_code === 0) {
          this.evaluate_history = body.data.list
        }
      }).catch(() => {
      });
      this.evaluate_name = (val.evalute_index).toString()
      this.evaluate_id = val.id
      this.evaluateVisible = true

    },
    commitEvaluate() {
      this.$refs['evaluateForm'].validate((valid) => {
        if (valid) {
          estimateService.commitEvaluate({ task_id: this.evaluate_id, remark: this.evaluateForm.remark }).then(({ body }) => {
            if (body.ret_code === 0) {
              this.$message.success(body.ret_msg)
              this.evaluateVisible = false
            }
          }).catch(() => {
          });
        }
      })
    },
    taskDetail() {
      this.$router.replace('task/reading')
    },

    indexMethod(index) {
      return index + 1;
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
.el-dialog__header {
  padding: 10px 20px;
  border-bottom: 1px solid #ebeef5;
}
.el-dialog__body {
  padding: 16px 20px;
}

    .el-form-item__content{
        margin: 0;
    }
.el-form-item__label{
    height: 30px;
}
</style>
