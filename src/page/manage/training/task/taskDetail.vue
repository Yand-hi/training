<template>
  <div class="task-container">
    <div class="task-detail" style="position:relative">

      <hzzt-title>任务详情</hzzt-title> 
      <!-- <el-button size="mini" type="primary" style="position:absolute;top:25;right:0;margin:0 25px" @click="backTask"> 返回</el-button> -->
      <br>

      <div class="detail-card">
        <p>
          <span> 任务名称：{{taskDetail.name}} </span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 模型分类：{{taskDetail.model_type}} </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span> 模型分类：{{taskDetail.model_name}} </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
        <p>
          测试集目录：<span v-for="item in train_folder" :key="item.id"> {{item.name}} &nbsp;&nbsp;&nbsp;</span>
        </p>
        <p>
          训练集目录：<span v-for="item in test_folder" :key="item.id"> {{item.name}}&nbsp;&nbsp;&nbsp;</span>
        </p>
        评估指标：
        <span v-for="item in evaluate_index" :key="item.id"> {{item.name}} </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span> 创建时间：{{taskDetail.created_at}} </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          状态：
          <span style="color:#F7B500" v-if="taskDetail.status === 0">● 未开始</span>
          <span style="color:#0091FF" v-if="taskDetail.status === 1">● 进行中</span>
          <span style="color:#67C23A" v-if="taskDetail.status === 2">● 已完成</span>
          <span style="color:#FA6400" v-if="taskDetail.status === 3">● 失败</span>
        </span>
      </div>
      <div class="task-img flex" v-if="taskDetail.status === 2">
        <div class="train-img flex column">
          <!-- <p> train/{{task_detail.log.train_value}} </p>
          <p> tag:train/{{task_detail.log.train_value}} </p> -->
          <p> train/loss</p>
          <p> tag:train/loss</p>
          <viewer class="img">
            <img style="width: 350px" src="../../../../assets/img/loss.png">
          </viewer>
        </div>
        <div class="test-img flex column">
          <!-- <p> train/{{task_detail.log.valid_value}}</p>
          <p> tag:train/{{task_detail.log.valid_value}}</p> -->
          <p> train/loss</p>
          <p> tag:train/loss</p>
          <viewer class="img">
            <img style="width: 350px" src="../../../../assets/img/loss.png">
          </viewer>
        </div>

      </div>
      <div class="task-log" v-if="taskDetail.status === 2">
        <p>日志</p>
        {{task_daily}}
      </div>

    </div>

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
      task_info: {},
      train_folder: [],
      test_folder: [],
      evaluate_index: '',
      task_detail: {},
      train_img: '',
      test_img: '',
      task_daily: '',




    }
  },
  mounted() {
    this.getDetail()
  },
  created() { },
  watch: {},
  computed: {
    taskDetail() {
      return JSON.parse(window.localStorage.getItem('task'))
    }


  },
  methods: {
    backTask() {
      this.$router.replace('/training/task')
    },

    getDetail() {
      this.task_info = JSON.parse(window.localStorage.getItem('task'))
      console.log(this.task_info)
      this.train_folder = this.task_info.train_folder
      this.test_folder = this.task_info.test_folder
      this.evaluate_index = this.task_info.evalute_index
      taskService.taskDetail({ id: this.task_info.id }).then(({ body }) => {
        if (body?.ret_code === 0) {
          this.task_detail = body.data
          this.task_daily=body.data.log.daily
          console.log(this.task_detail.log)
          this.train_img = `/api/process/get_image?${this.task_detail.log.train_path}`
          this.test_img = `/api/process/get_image?${this.task_detail.log.test_path}`
        }
      })


    },



  }

}
</script>

<style lang="scss" scoped>
.task-container {
  background: #fff;
  height: calc(100vh - 40px);
  .task-detail {
    height: calc(100vh - 100px);
    background: #fff;
    padding: 25px;
    .detail-card {
      border: 1px solid #ebeef5;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      min-width: 600px;
      max-width: 800px;
      box-shadow: 5px 5px 5px #ebeef5;
    }
    .task-img {
      margin-top: 30px;
      .train-img {
        margin-right: 60px;
      }
      .img {
        margin: 20px 0;
      }
    }
    .task-log{
      min-width: 1100px;

    }
  }
}
</style>