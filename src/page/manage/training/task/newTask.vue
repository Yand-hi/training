<template>
  <div class="task-container">
    <el-form :inline="true" :model="taskForm" :rules="taskRules" ref="taskForm" class="taskForm">
      <hzzt-title>创建任务</hzzt-title>
      <br>
      <el-row :span="24" style="margin-bottom:15px">
        <el-col :span="6.5">
          <el-form-item required label="任务名称：" label-width="150px" prop="name">
            <el-input size="mini" v-model="taskForm.name" clearable placeholder="请输入任务名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5.5">
          <el-form-item label="病理分类：" required prop="slice_type_id">
            <el-select clearable size="mini" v-model="taskForm.slice_type_id" placeholder="请选择病理分类" @change="getModelTypeSelection">
              <el-option v-for="type in sliceTypeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5.5">
          <el-form-item label="模型类型：" required prop="model_type_id">
            <el-select clearable size="mini" v-model="taskForm.model_type_id" placeholder="请选择模型类型" @change="getModelNameSelection">
              <el-option v-for="type in modelTypeList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5.5">
          <el-form-item label="模型名称：" required prop="model_name">
            <el-select clearable size="mini" v-model="taskForm.model_name" placeholder="请选择模型名称" @change="getHistory">
              <el-option v-for="(item,index) in modelNameList" :label="item.model_name" :value="item.model_name" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="24">
          <el-form-item label="参数：" label-width="150px" class="flex">
            <span v-for="item in modelParams" :key="item.id">
              <span>
                {{item.name}}:{{item.value}}&nbsp;&nbsp;&nbsp;
              </span>
            </span>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="6.5">
          <el-form-item label="历史配置信息导入：" label-width="150px">
            <el-select clearable :disabled="!taskForm.history_true" size="mini" placeholder="请选择配置信息" v-model="taskForm.history" @change="getHistoryList">
              <el-option v-for="(item,index) in modelHistory" :label="item.name" :value="item" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item label="" label-width="100px" prop="analysis_style">
            <el-checkbox v-model="taskForm.history_true" @change="showHistory" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="3">
          <el-form-item label="训练集：" label-width="150px" required>
          </el-form-item>
        </el-col>
        <el-col :span="20" style="margin-bottom:20px">
          <el-form-item label="" required prop="trainFolder">
            <el-checkbox-group v-model="taskForm.trainFolder" @change="getInfo('1', $event)" class="flex wrap">
              <el-checkbox :key="item.id" :label="item.id" v-for="item in trainFolder">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="训练集概况：" label-width="150px">
          <el-card class="allocation-card" shadow="hover" style="margin-top:10px;width:1060px">
            <div slot="header" class="column flex justify-content-between align-items-start">
              <div class="flex justify-content-center align-items-center" style="height:25px" v-for="item in trainFolderInfo" :key="item.id">
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
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="已选中训练集概况：" label-width="150px">
          <el-card class="allocation-card" shadow="hover" style="margin-top:10px;width:1060px" v-show="showTrainInfo">
            <div slot="header" class="column flex justify-content-between align-items-start">
              <div class="flex justify-content-center align-items-center" style="height:25px">
                <span>
                  1.切片总数量: &nbsp;{{trainFolderInfoAll.total_slice_count}} &nbsp;&nbsp;&nbsp;
                  2.ROI框数量: &nbsp;{{trainFolderInfoAll.total_roi_count}}&nbsp;&nbsp;&nbsp;
                  3.细胞分类统计：&nbsp;
                  <span v-for="(cell,index) of trainFolderInfoAll.total_cat" :key="index">
                    {{cell.key}} :&nbsp;{{cell.value}}&nbsp;&nbsp;&nbsp;
                  </span>
                </span>
              </div>
            </div>
          </el-card>
        </el-form-item>

      </el-row>
      <el-row :span="24" style="margin-bottom:20px">
        <el-col :span="3">
          <el-form-item label="测试集：" label-width="150px" required>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="" required prop="testFolder">
            <el-checkbox-group v-model="taskForm.testFolder" @change="getInfo('2', $event)">
              <el-checkbox :key="item.id" :label="item.id" v-for="item in testFolder">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="测试集概况：" label-width="150px">
          <el-card class="allocation-card" shadow="hover" style="margin-top:10px;width:1060px">
            <div slot="header" class="column flex justify-content-between align-items-start">
              <div class="flex justify-content-center align-items-center" style="height:25px" v-for="item in testFolderInfo" :key="item.id">
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
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="已选中测试集概况：" label-width="150px">
          <el-card class="allocation-card" shadow="hover" style="margin-top:10px;width:1060px" v-show="showTestInfo">
            <div slot="header" class="column flex justify-content-between align-items-start">
              <div class="">
                <span>
                  1.切片总数量: &nbsp;{{testFolderInfoAll.total_slice_count}} &nbsp;&nbsp;&nbsp;
                  2.ROI框数量: &nbsp;{{testFolderInfoAll.total_roi_count}}&nbsp;&nbsp;&nbsp;
                  3.细胞分类统计：&nbsp;
                  <span v-for="(cell,index) of testFolderInfoAll.total_cat" :key="index">
                    {{cell.key}} :&nbsp;{{cell.value}}&nbsp;&nbsp;&nbsp;
                  </span>
                </span>
              </div>
            </div>
          </el-card>
        </el-form-item>

      </el-row>
      <el-row :span="24">
        <el-col :span="10">
          <el-form-item label="评估指标：" label-width="150px" prop="evalute_index_name">
            <el-select size="mini" clearable multiple v-model="taskForm.evalute_index_name"  disabled >
              <el-option v-for="type in evaluateList" :label="type.name" :value="type.id" :key="type.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row class="flex justify-content-center align-items-center">
        <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        <el-button size="mini" type="danger" @click="backTask()">取消</el-button>

      </el-row>
    </el-form>

  </div>

</template>

<script>
import hzztTitle from '@/components/hzztTitle';
import { taskService } from '@/page/manage/training/task/task.service';

export default {
  components: {
    hzztTitle,
  },
  data() {
    return {
      taskForm: {
        name: '',
        slice_type_id: null,
        model_type_id: null,
        model_name: null,
        history: null,
        testFolder: [],
        trainFolder: []
      },
      multipleSelection: [],
      sliceTypeList: [],
      modelTypeList: [],
      modelNameList: [],
      evaluateList: [],
      testFolder: [],// 所有数据
      trainFolder: [],// 所有数据
      modelHistory: [],
      taskRules: {
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        slice_type_id: [{ required: true, message: '请选择病理分类', trigger: 'change' }],
        model_type_id: [{ required: true, message: '请选择模型分类', trigger: 'change' }],
        model_name: [{ required: true, message: '请选择模型名称', trigger: 'change' }],
        trainFolder: [{ required: true, message: '请至少选择一个训练集', trigger: 'change' }],
        testFolder: [{ required: true, message: '请至少选择一个测试集', trigger: 'change' }],
        evalute_index_ids: [{ required: true, message: '请选择评估指标', trigger: 'change' }],
        evalute_index_name: [{ required: true, message: '请选择评估指标', trigger: 'change' }],
      },
      trainHistory: [], //后台数据
      testHistory: [], //后台数据
      trainFolderInfo: [],
      testFolderInfo: [],
      trainFolderInfoAll: [],
      testFolderInfoAll: [],
      showTrainInfo: false,
      showTestInfo: false,
      modelParams: []

    }
  },
  mounted() {
    this.getFolderList()
  },
  created() { },
  watch: {},
  methods: {
    backTask() {
      this.$router.push('/training/task')
    },
    //初始化选项
    getFolderList() {
      taskService.getSliceType({ type: 2 }).then(res => {
        if (res.body?.ret_code === 0) {
          this.sliceTypeList = res.body.data.list
        }
      }).catch(() => {
      });
      taskService.folderList({ type: 1 }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.trainFolder = body.data.list
          taskService.getFolderInfo({ ids: (this.trainFolder.map(i => i.id)).toString() }).then(({ body }) => {
            if (body.ret_code === 0) {
              this.trainFolderInfo = body.data.list
              console.log(this.trainFolderInfo)
            }
          })
        }
      });

      taskService.folderList({ type: 2 }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.testFolder = body.data.list
          taskService.getFolderInfo({ ids: (this.testFolder.map(i => i.id)).toString() }).then(({ body }) => {
            if (body.ret_code === 0) {
              this.testFolderInfo = body.data.list
            }
          })
        }
      });
    //   taskService.getEvaluate().then(({ body }) => {
    //     if (body?.ret_code === 0) {
    //       this.evaluateList = body.data.list
    //     }
    //   });

    },
    //获得模型类型下拉框
    getModelTypeSelection(data) {
      this.taskForm.model_type_id = null
      this.taskForm.model_name = null
      this.taskForm.history = null
      taskService.getModelType({ slice_type_id: data || '' }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.modelTypeList = body.data.list
        }
      }).catch(() => {
      });
    },
    //获得模型名称下拉框
    getModelNameSelection(data) {
      this.taskForm.model_name = null
      this.taskForm.history = null
      taskService.getModelName({ model_type_id: data || '' }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.modelNameList = body.data
          console.log(this.modelNameList)
        }
      }).catch(() => {
      });
    },
    //获得历史配置
    getHistory(data) {
      this.taskForm.history = null
      taskService.getModelHistory({ model_name: data || '' }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.modelHistory = (body.data).map((item) => ({
            ...item,
            id: item.task.id,
            name: item.task.name
          }))
          console.log(this.modelHistory)
        }
      }).catch(() => {
      });
      taskService.getModelParams({ model_name: data || '' }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.modelParams = body.data.list
          console.log(this.modelParams)
        }
      }).catch(() => {
      });
      taskService.getEvaluate({ model_name: data || '' }).then(({ body }) => {
        if (body?.ret_code === 0) {
        //   this.modelParams = body.data.list
          console.log(body.data.list)
          this.taskForm.evalute_index_ids= body.data.list.map(i=>i.id)
          this.taskForm.evalute_index_name= body.data.list.map(i=>i.name)
          console.log(this.taskForm)
        }
      }).catch(() => {
      });
    },
    //获得历史测试集，训练集
    getHistoryList(data) {
      this.trainHistory = (data.train).map(i => i.id)
      console.log(this.trainHistory)
      this.taskForm.trainFolder = this.trainHistory
      this.testHistory = (data.test).map(i => i.id)
      this.taskForm.testFolder = this.testHistory
      if (this.trainHistory.length > 0) {
        this.showTrainInfo = true
        taskService.getFolderInfo({ ids: (this.trainHistory).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            this.trainFolderInfo = body.data.list
            this.trainFolderInfoAll = body.data
            console.log(this.trainFolderInfo)
          }
        })
      } else if (this.testHistory.length > 0) {
        this.showTestInfo = true
        taskService.getFolderInfo({ ids: (this.testHistory).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            this.testFolderInfo = body.data.list
            this.testFolderInfoAll = body.data
            console.log(this.testFolderInfo)
          }
        })

      }
    },
    showHistory() {
      this.taskForm.history = null
      this.taskForm.trainFolder = []
      this.taskForm.testFolder = []
      this.showTrainInfo = false
      this.showTestInfo = false
    },
    cellCheck(cell, value) {
      if (!value) {
        cell.children.forEach((item) => (item.checked = value));
      }
    },
    onSubmit() {
      this.$refs['taskForm'].validate((valid) => {
        if (valid) {
          console.log(this.taskForm)
          taskService.addTask({
            ...this.taskForm,
            train_folder_ids: (this.taskForm.trainFolder).toString(),
            test_folder_ids: (this.taskForm.testFolder).toString(),
            evalute_index_ids: (this.taskForm.evalute_index_ids).toString()
          }).then(({ body }) => {
            if (body?.ret_code === 0) {
              this.$message.success('新建任务成功')
              this.$router.push('/training/task')
            }
          }).catch(() => {
          });

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getInfo(type, $event) {
      console.log($event)
      if ($event.length === 0) {
        this.showTrainInfo = false
        this.showTestInfo = false
      } else if (type === '1' && $event.length > 0) {
        this.showTrainInfo = true
        taskService.getFolderInfo({ ids: ($event).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            // this.trainFolderInfo = body.data.list
            this.trainFolderInfoAll = body.data
            console.log(this.trainFolderInfo)
          }
        })
      } else if (type === '2' && $event.length > 0) {
        this.showTestInfo = true
        taskService.getFolderInfo({ ids: ($event).toString() }).then(({ body }) => {
          if (body.ret_code === 0) {
            // this.testFolderInfo = body.data.list
            this.testFolderInfoAll = body.data
            console.log(this.testFolderInfo)
          }
        })

      }
    },



  }

}
</script>

<style lang="scss" scoped>
.taskForm {
  color: #606266;
  background-color: #fff;
  font-size: 14px;
  padding: 25px;
  overflow: auto;
}

.el-form-item__content {
  line-height: 20px;
}
.task-container {
  background: #fff;
  height: calc(100vh - 40px);
}
::v-deep {
  .el-card__body {
    padding: 0 !important;
  }
}
</style>