<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>工作量统计</hzzt-title>
      <el-date-picker
        v-model="rangDate"
        type="daterange"
        align="right"
        unlink-panels
        :clearable="false"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="changeDate">
      </el-date-picker>
    </div>
    <div class="common-table">
      <div class="common-table-header flex justify-content-between align-items-center">
        <el-tabs style="width: 100%;" @tab-click="handleClick" v-model="activeTabName">
          <el-tab-pane label="新增切片" style="width: 100%;" name="新增切片">
            <div v-show="!noSliceData" class="cate-style">
              <div id="slice-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noSliceData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
          <el-tab-pane label="新增阴阳性" style="width: 100%;" name="新增阴阳性">
            <div v-show="!noDiagnoseData" class="cate-style">
              <div id="diagnose-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noDiagnoseData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
          <el-tab-pane label="新增状态" style="width: 100%;" name="新增状态">
            <div v-show="!noStatusData" class="cate-style">
              <div id="status-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noStatusData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {statisticsService} from '../statistics.service';
  import {formatDateTime} from '../../../../config/utils';

  var echarts = require('echarts');
  export default {
    components: {
      hzztTitle,
    },
    data() {
      const end = new Date();
      const start = new Date();
      return {
        activeTabName: '新增切片',
        noSliceData: false,
        noStatusData: false,
        noDiagnoseData: false,
        rangDate: [],
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            }, {
              text: '最近一个月',
              onClick(picker) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            }, {
              text: '最近三个月',
              onClick(picker) {
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            }],
        },
      };
    },
    created() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      this.rangDate = [start, end];
    },
    mounted() {
      this.queryNewSlice({
        start_time: formatDateTime(this.rangDate[0], '-'),
        end_time: formatDateTime(this.rangDate[1], '-'),
      });
      // this.getDefaultTime();
      // this.queryLine();
    },
    methods: {
      // 饼图数据查询
      queryNewSlice(params) {
        statisticsService.queryNewSlice(params).then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const xAxis = body.data.map(({hospital}) => hospital);
              const series = [
                {
                  data: body?.data.map(({count}) => count),
                  name: '切片',
                  type: 'bar',
                }];
              this.drawOrigin(xAxis, [], series, 'slice-echart');
            }
          } else {
            this.noSliceData = true;
          }
        }).catch((e) => this.noSliceData = true);
      },
      queryNewDiagnose(params) {
        statisticsService.queryNewDiagnose(params).then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const xAxis = body.data.map(({diagnose}) => diagnose);
              const series = [
                {
                  data: body?.data.map(({count}) => count),
                  name: '阴阳性',
                  type: 'bar',
                }];
              this.drawOrigin(xAxis, [], series, 'diagnose-echart');
            } else {
              this.noDiagnoseData = true;
            }
          } else {
            this.noDiagnoseData = true;
          }
        }).catch(() => this.noDiagnoseData = true);
      },
      queryNewStatus(params) {
        statisticsService.queryNewStatus(params).then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const xAxis = body.data.map(({status}) => status);
              const series = [
                {
                  data: body?.data.map(({count}) => count),
                  name: '阴阳性',
                  type: 'bar',
                }];
              this.drawOrigin(xAxis, [], series, 'status-echart');
            } else {
              this.noStatusData = true;
            }
          } else {
            this.noStatusData = true;
          }
        }).catch(() => this.noStatusData = true);
      },
      drawOrigin(xAxis, legend, series, id) {
        let originBar = echarts.init(document.getElementById(id));
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          legend: {
            data: legend,
          },
          xAxis: [
            {
              type: 'category',
              axisTick: {
                alignWithLabel: true,
              },
              data: xAxis,
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '数量',
              position: 'left',
              /*  axisLine: {
                  lineStyle: {
                    color: colors[2],
                  },
                },*/
              axisLabel: {
                formatter: '{value} 个',
              },
            },
          ],
          series: series,
        };
        originBar.setOption(option);
      },
      changeDate() {
        this.queryNewSlice({
          start_time: formatDateTime(this.rangDate[0], '-'),
          end_time: formatDateTime(this.rangDate[1], '-'),
        });
      },
      handleClick(tab, event) {
        if (tab.name === '新增切片') {
          this.queryNewSlice({
            start_time: formatDateTime(this.rangDate[0], '-'),
            end_time: formatDateTime(this.rangDate[1], '-'),
          });
        }
        if (tab.name === '新增阴阳性') {
          this.queryNewDiagnose({
            start_time: formatDateTime(this.rangDate[0], '-'),
            end_time: formatDateTime(this.rangDate[1], '-'),
          });
        }
        if (tab.name === '新增状态') {
          this.queryNewStatus({
            start_time: formatDateTime(this.rangDate[0], '-'),
            end_time: formatDateTime(this.rangDate[1], '-'),
          });
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .common-table-header {
    margin: 0 0 25px;
    .line-head {
      display: flex;
      justify-content: flex-end;
    }
  }

  .cate-style {
    width: 100%;
    height: 500px;
    margin: 50px auto;
    display: flex
  }

  .el-select {
    width: 70px;
  }
</style>
