<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>数据清洗-审核列表</hzzt-title>
    </div>
    <div class="common-table">
      <div class="common-table-header flex justify-content-between align-items-center" >
        <el-tabs style="width: 100%" @tab-click="handleClick" v-model="activeTabName" >
          <el-tab-pane label="待审核清洗" style="width: 100%" name="待审核清洗">
            <div v-show="!noSliceData" class="cate-style">
              <div id="slice-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noSliceData" class="cate-style align-items-center justify-content-center" >
              暂无统计数据
            </div>
          </el-tab-pane>
          <el-tab-pane label="已审核清洗" style="width: 100%" name="已审核清洗">
            <div v-show="!noDiagnoseData" class="cate-style">
              <div id="diagnose-echart" class="flex-1" style="height: 500px" ></div>
            </div>
            <div v-show="noDiagnoseData" class="cate-style align-items-center justify-content-center">
              暂无统计数据
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import hzztTitle from "@/components/hzztTitle";
export default {
  components: {
    hzztTitle,
  },
  data() {
    return {
      activeTabName: "待审核清洗",
      noSliceData: false,
      noDiagnoseData: false,
    };
  },
  methods: {
    handleClick() {
      
    }
  }
};
</script>

<style></style>
