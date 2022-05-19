<template>
  <div class="main-container entry-main">
    <div class="common-header">
      <div class="flex align-items-center " style='position: relative;width:100%'>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="病理分类：">
            <el-select size="mini" clearable v-model="searchForm.slice_type_id" placeholder="请选择病理分类">
              <el-option v-for="item in sliceTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模型分类：">
            <el-select size="mini" clearable v-model="searchForm.model_type_id" placeholder="请选择模型分类">
              <el-option v-for="item in modelTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style='position: absolute;right:0;top:0;'>
            <el-button size="mini" type="primary" @click="configList">查询</el-button>
            <el-button size="mini" type="primary" @click="clearValue">重置</el-button>
            <el-button size="mini" type="danger" @click="showConfigDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table :row-style="{height:'20px'}" :cell-style="{padding:'0px'}" stripe v-loading="tableLoading" :data="data" border style="width: 100%">
          <el-table-column v-for="(data, index) in headers" :key="index" :fixed="data.fixed" :prop="data.prop" :label="data.label" :height='tableHeight' show-overflow-tooltip :min-width="data['min-width']" :align="data.align">
          </el-table-column>
          <el-table-column align="center" prop="config" label="评估指标" min-width="80px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.evalute_index" :key="item.id">
                {{item.name}}
              </span>

            </template>
          </el-table-column>
          <el-table-column align="center" prop="evaluate" label="参数" min-width="80px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.param" :key="item.id">
                {{item.name}}:{{item.value}}
              </span>

            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="primary" size="mini" @click="editConfig(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteConfig(scope.row)">删除</el-button>
                <el-button type="success" size="mini" @click="setConfig(scope.row)">设置参数</el-button>
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
    <el-dialog width="400px" title="新增配置" :visible.sync="configDialogVisible" v-if="configDialogVisible">
      <el-form label-width="90px" :model="configForm" :rules="rules" ref="configForm">
        <el-row>
          <el-col :span="20" style="">
            <el-form-item label="病理分类" required prop="slice_type_id">
              <el-select clearable size="mini" v-model="configForm.slice_type_id" placeholder="请选择病理分类">
                <el-option v-for="item in sliceTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" style="">
            <el-form-item label="模型类型" required prop="model_type_id">
              <el-select clearable size="mini" v-model="configForm.model_type_id" placeholder="请选择模型类型">
                <el-option v-for="item in modelTypeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="19" style="">
            <el-form-item label="模型名称" required prop="model_name">
              <el-input size="mini" v-model="configForm.model_name" placeholder="请输入模型名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20" style="padding:0">
            <el-form-item label="评估指标" required prop="evalute_index_ids">
              <el-select clearable size="mini" multiple v-model="configForm.evalute_index_ids" placeholder="请选择评估指标">
                <el-option v-for="item in evaluateList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="configDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="newConfig">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="600px" title="设置参数" :visible.sync="paramDialogVisible" v-if="paramDialogVisible">
      <el-form label-width="80px" :model="paramForm" ref="paramForm">
        <el-row :span="24" class="flex">
          <el-col :span="10" style="padding:0">
            <el-form-item v-for="(config,index) in paramForm.configs" label="参数名称" :key="index" :prop="'configs.'+index+'.name'" :rules="{ 
                required: true, message: '参数名称不能为空', trigger: 'blur'}">
              <el-input size="mini" v-model="config.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding:0">
            <el-form-item v-for="(config,index) in paramForm.configs" label="参数值" :key="index" :prop="'configs.'+index+'.value'" :rules="{
                required: true, message: '参数值不能为空', trigger: 'blur'  }">
              <el-input size="mini" v-model="config.value"></el-input>
              <i class="el-icon-remove-outline" style="color:#F56C6C;margin-left:10px" @click.prevent="removeParam(config)"></i>
              <i class="el-icon-circle-plus-outline" style="color:#67C23A;margin-left:8px" @click="addParam"></i>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="mini" @click="paramDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="newConfigParam">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { taskService } from '@/page/manage/training/task/task.service';
import { collocateService } from '@/page/manage/training/collocate/collocate.service';
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
          'prop': 'pathology_type',
          'label': '病理分类',
          'min-width': 120,
          'align': 'center',
        }, {
          'prop': 'model_type',
          'label': '模型类型',
          'min-width': 80,
          'align': 'center',
        }, {
          'prop': 'model_name',
          'label': '模型',
          'min-width': 80,
          'align': 'center',
        },
      ],
      slice_type_id: '',
      loading: false,
      modelTypeList: {},
      configForm: {
        slice_type_id: '',
        model_type_id: '',
        model_name: '',
        evalute_index_ids: []
      },
      pagination: { count: 0, current_page: 1, per_page: 15 },
      tableHeight: '100%',
      tableLoading: false,
      configDialogVisible: false,
      paramDialogVisible: false,
      pagination: {
        current: 1,
        pageSize: 15,
        showTotal: total => `共 ${total} 条`,
        total: 0,
      },
      searchForm: {},
      evaluateList: {},
      sliceTypeList: {},
      rules: {
        slice_type_id: [{ required: true, message: '请选择病理分类', trigger: 'change' }],
        model_type_id: [{ required: true, message: '请选择模型类型', trigger: 'change' }],
        model_name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
        evalute_index_ids: [{ required: true, message: '请选择评估指标', trigger: 'change' }],
      },
      paramForm: {
        configs: [
          {
            name: '学习率',
            value: '0.001'
          },
          {
            name: '优化器',
            value: 'SGD'
          },
        ],
        id: ''
      },
      editConfigData: {}
    };
  },
  mounted() {

  },
  computed: {
    ...mapState(['user']),

  },
  created() {
    this.configList();
    this.getFolderList();
  },
  methods: {
    //初始化选项
    getFolderList() {
      taskService.getSliceType({ type: 2 }).then(res => {
        if (res.body?.ret_code === 0) {
          this.sliceTypeList = res.body.data.list
        }
      }).catch(() => {
      });
      taskService.getEvaluate().then(({ body }) => {
        if (body?.ret_code === 0) {
          this.evaluateList = body.data.list
        }
      });
      taskService.getModelType({ slice_type_id: '' }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.modelTypeList = body.data.list
        }
      }).catch(() => {
      });
    },

    // 获得列表
    configList() {
      this.tableLoading = true;
      collocateService.getConfigList({ ...this.searchForm }).then(({ body }) => {
        if (body.ret_code === 0) {
          this.data = (body.data.list).map((item) => ({
            ...item,
            pathology_type: item.slice_type?.name,
            model_type: item.model_type?.name,
          }))
          this.pagination = body.data.meta;
        //   console.log(this.data)
        }
      }).catch((err) => {
        // console.log(err);
        this.pagination = { count: 0, current_page: 1, per_page: 15 };
      }).finally(() => {
        this.tableLoading = false;
      });

    },

    // 重置表单
    clearValue() {
      this.searchForm.slice_type_id = undefined
      this.searchForm.model_type_id = undefined
      this.configList()
    },

    //分页页码改变事件
    handleCurrentChange(val) {
      this.configList();
    },

    showConfigDialog() {
      this.configForm = {
        slice_type_id: '',
        model_type_id: '',
        model_name: '',
        evalute_index_ids: []
      }
      this.configDialogVisible = true
    },
    //新增配置
    newConfig() {

      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          collocateService.addConfig({
            ...this.configForm,
            evalute_index_ids: (this.configForm.evalute_index_ids).toString(),
            id: this.configForm.id || null,
          }).then(({ body }) => {
            if (body.ret_code === 0) {
              this.configDialogVisible = false
              this.configList()
            }
          }).catch(() => {
            this.pagination = { count: 0, current_page: 1, per_page: 15 };
          }).finally(() => {
          });
        }
      })
    },
    //编辑配置  
    editConfig(val) {
      this.configDialogVisible = true
      this.configForm.id = val.id
      this.editConfigData = this.data.filter(item => item.id === this.configForm.id)[0]
      this.configForm.slice_type_id = this.editConfigData.slice_type.id || ''
      this.configForm.model_type_id = this.editConfigData.model_type_id || ''
      this.configForm.model_name = this.editConfigData.model_name || ''
      this.configForm.evalute_index_ids = this.editConfigData.evalute_index.map(i => i.id) || ''
    },
    //删除配置
    deleteConfig(val) {
    //   console.log(val.id)
      this.$confirm('是否删除该切片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        collocateService.deleteConfig(val.id).then(({ body }) => {
          if (body.ret_code === 0) {
            this.$message.success('删除成功')
            this.configList()
          }
        })
      });
    },

    //设置参数
    setConfig(val) {
    //   console.log(val)
      this.paramDialogVisible = true
      this.paramForm.id = val.id

    },
    newConfigParam() {

      this.$refs['paramForm'].validate((valid) => {
        if (valid) {
          const params = {
            param: this.paramForm.configs,
            id: this.paramForm.id
          }
          collocateService.addConfig(params).then(({ body }) => {
            if (body.ret_code === 0) {
              this.paramDialogVisible = false
              this.configList()
            }
          }).catch(() => {
            this.pagination = { count: 0, current_page: 1, per_page: 15 };
          }).finally(() => {
          });


        }
      })


    },
    removeParam(item) {
      var index = this.paramForm.configs.indexOf(item)
      if (index !== -1) {
        this.paramForm.configs.splice(index, 1)
      }
    },
    addParam() {
      this.paramForm.configs.push({
        value: '',
        key: Date.now()
      });
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
.el-form-item__content {
  display: flex;
  align-items: center;
  -webkit-align-items: center;
}
.slice-name-input {
  max-width: 182px;
}

.el-form-item {
  color: #676767;
  margin-bottom: 10px;

  .el-form-item__label {
    color: #222222;
    margin-bottom: 10px;
  }

  .el-button--text {
    margin-left: 60px;
  }
}
</style>
