<template>
  <div class="main-container entry-main">
    <div class="common-header">
      <div class="flex align-items-center " style='position: relative;width:100%'>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="">
            <el-input size="mini" v-model="searchForm.name" @keypress.native.enter="onSubmit" clearable placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select size="mini" v-model="searchForm.model_type_id"  clearable placeholder="请选择模型类型">
              <el-option v-for="type in modelTypeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select size="mini" v-model="searchForm.model_name" clearable placeholder="请选择模型名称">
              <el-option v-for="(item,index) in modelNameList" :label="item.model_name" :value="item.model_name" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select size="mini" v-model="searchForm.train_folder_ids" clearable placeholder="请选择训练集">
              <el-option v-for="train in trainFolder" :label="train.name" :value="train.id" :key="train.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select size="mini" v-model="searchForm.test_folder_ids" clearable placeholder="请选择测试集">
              <el-option v-for="test in testFolder" :label="test.name" :value="test.id" :key="test.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-select size="mini" v-model="searchForm.status" placeholder="请选择任务状态">
              <el-option label="未开始" :value="0"></el-option>
              <el-option label="进行中" :value="1"></el-option>
              <el-option label="已完成" :value="2"></el-option>
              <el-option label="失败" :value="3"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item style='position: absolute;right:0;top:0;'>
            <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
            <el-button size="mini" type="primary" @click="clearValue()">重置</el-button>
            <el-button size="mini" type="danger" @click="newTask()">创建任务</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="slice-body flex">
      <div class="slice-table common-table">
        <el-table :row-style="{height:'20px'}" :cell-style="{padding:'0px'}" stripe v-loading="tableLoading" :data="data" border :height='tableHeight' style="width: 100%">
          <el-table-column align="center" type="index" label="序号" width="50" :index="indexMethod"></el-table-column>
          <el-table-column align="center" prop="name" label="任务名称" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="pathology_type" label="病理分类" min-width="80px"> </el-table-column>
          <el-table-column align="center" prop="model_type" label="模型类型" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="model_name" label="模型名称" min-width="120px"> </el-table-column>
          <el-table-column align="center" prop="train_folder" label="训练集目录" min-width="140px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.train_folder" :key="item.id">
                {{item.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="test_folder" label="测试集目录" min-width="140px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.test_folder" :key="item.id">
                {{item.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="创建时间" min-width="140px" show-overflow-tooltip> </el-table-column>
          <el-table-column align="center" prop="evalute_index" label="评估指标" min-width="140px" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-for="item in scope.row.evalute_index" :key="item.name">
                {{item.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="状态" min-width="80px">
            <template slot-scope="scope">
              <span style="color:#F7B500" v-if="scope.row.status === 0">● 未开始</span>
              <span style="color:#0091FF" v-if="scope.row.status === 1">● 进行中</span>
              <span style="color:#67C23A" v-if="scope.row.status === 2">● 已完成</span>
              <span style="color:#FA6400" v-if="scope.row.status === 3">● 失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="operate" align="center" label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="danger" size="mini" @click="deleteTask(scope.row)">删除</el-button>
                <el-button type="primary" size="mini" @click="taskDetail(scope.row)">查看</el-button>
                <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="startTask(scope.row)">开始任务</el-button>
                <!-- <el-button v-if="scope.row.status === 1" type="warning" size="mini" @click="startTask(scope.row)">暂停任务</el-button> -->
                <el-button v-if="scope.row.status === 2||scope.row.status === 3" type="success" size="mini" @click="startTask(scope.row)">重新开始</el-button>
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
  </div>
</template>
<script>
import hzztTitle from '@/components/hzztTitle';
import pisSlideView from '@/components/pisSlideView/pisSlideView';
import { taskService } from '@/page/manage/training/task/task.service';
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
      pathology_id: '',
      is_assign: '',
      slice_type_id: '',
      name: '',
      real_name: '',
      slice_folder_type: '',
      loading: false,
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
      testFolder: [],
      trainFolder: []
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
        status: '',
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
        // status: this.searchForm.status || '',
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
    // clearValue() {
    //   this.searchForm.name = undefined
    //   this.searchForm.pathology_id = undefined
    //   this.searchForm.real_name = undefined
    //   this.searchForm.slice_type = undefined
    //   this.onSubmit()
    // },

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


    // 重置
    clearValue() {
      this.is_assign = undefined
      this.slice_type_id = undefined
      this.name = undefined
      this.real_name = undefined
      this.slice_folder_type = undefined
      this.folder_id = undefined
      this.sliceList();
    },

    newTask() {
      this.$router.push('task/add')
    },
    deleteTask(val) {
      console.log(val)
      this.$confirm('是否删除该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskService.deleteTask({ id: val.id }).then(({ body }) => {
          if (body?.ret_code === 0) {
            this.$message.success('删除成功')
            this.taskList()
          }
        })
      })
    },
    startTask(val) {
      taskService.startStudy({ id: val.id }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.$message.success('任务已开始')
          this.taskList()
        }
      })

    },
    taskDetail(val) {
      console.log(val)
      this.$store.commit('setTask', val)
      this.$router.push('task/reading')
      window.localStorage.setItem('task', JSON.stringify(val))
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
.slice-name-input {
  max-width: 182px;
}

.slice-pathological-dialog {
  .el-dialog--center {
    width: 500px;

    .el-form-item {
      color: #676767;
      margin-bottom: 10px;

      .el-form-item__label {
        color: #222222;
      }

      .el-button--text {
        margin-left: 60px;
      }
    }
  }
}

.entry-source-dialog {
  .el-dialog--center {
    width: 400px;

    .el-form-item {
      color: #676767;
      margin-bottom: 20px;

      .el-form-item__label {
        color: #222222;
      }

      .el-input {
        max-width: 217px;
      }

      .el-textarea {
        max-width: 217px;
      }

      .form-age {
        display: inline-block;
        width: 217px;
      }

      .el-button--text {
        margin-left: 20px;
      }

      .el-input__inner {
        height: 31px;
      }
    }
  }
}

.entry-pathological-dialog {
  .el-dialog--center {
    min-width: 510px;
    max-width: 600px;

    .el-form-item {
      color: #676767;
      margin-bottom: 20px;

      .el-form-item__label {
        color: #222222;
      }

      .el-input {
        max-width: 217px;
      }

      .el-textarea {
        max-width: 217px;
      }

      .form-age {
        display: inline-block;
        width: 217px;
      }

      .el-button--text {
        margin-left: 20px;
      }

      .el-input__inner {
        height: 31px;
      }
    }
  }
}

.slide-view-dialog {
  .el-dialog {
    display: flex;
    flex-direction: column;

    .slide-dialog-header {
      .close-btn {
        cursor: pointer;
        height: 25px;
        width: 25px;

        img {
          width: 100%;
        }
      }
    }

    .el-dialog__header {
      padding: 10px 20px;
    }

    .el-dialog__body {
      flex: 1;
      padding: 0;
    }
  }
}

.entry-template-btn {
  .el-button {
    margin: 5px 0;

    & + .el-button {
      margin-left: 0;
    }
  }
}
</style>
