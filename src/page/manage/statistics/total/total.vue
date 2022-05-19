<template>
  <div class="main-container">
    <div class="common-header">
      <hzzt-title>切片总量统计</hzzt-title>
    </div>
    <div class="common-table">
      <div class="common-table-header flex justify-content-between align-items-center">
        <el-tabs style="width: 100%;" @tab-click="handleClick" v-model="activeTabName">
          <el-tab-pane label="来源统计" style="width: 100%;" name="来源统计">
            <div v-show="!noOriginData" class="cate-style">
              <div id="origin-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noOriginData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
          <el-tab-pane label="状态统计" style="width: 100%;" name="状态统计">
            <div v-show="!noStatusData" class="cate-style">
              <div id="status-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noStatusData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
          <el-tab-pane label="阴阳性统计" style="width: 100%;" name="阴阳性统计">
            <div v-show="!noDiagnoseData" class="cate-style">
              <div id="diagnose-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noDiagnoseData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
          <el-tab-pane label="分类统计" style="width: 100%;" name="分类统计">
            <div v-show="!noCateData" class="cate-style">
              <div id="cate-echart" class="flex-1" style="height: 500px"></div>
            </div>
            <div v-show="noCateData" class="cate-style align-items-center justify-content-center">暂无统计数据</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>

  import hzztTitle from '@/components/hzztTitle';
  import {statisticsService} from '../statistics.service';

  var echarts = require('echarts');
  export default {
    components: {
      hzztTitle,
    },
    data() {
      return {
        activeTabName: '来源统计',
        noOriginData: false,
        noStatusData: false,
        noDiagnoseData: false,
        noCateData: false,
      };
    },
    created() {
    },
    mounted() {
      this.queryOriginTotal();
      // this.getDefaultTime();
      // this.queryLine();
    },
    methods: {
      // 饼图数据查询
      queryOriginTotal() {
        statisticsService.queryTotal().then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const xAxis = body.data.map(({hospital}) => hospital);
              const legend = ['未标注', '已标注', '已精修'];
              const series = [
                {
                  data: body?.data.map(({unmark}) => unmark),
                  name: '未标注',
                  type: 'bar',
                  stack: '标注',
                }, {
                  data: body?.data.map(({marked}) => marked),
                  name: '已标注',
                  type: 'bar',
                  stack: '标注',
                }, {
                  data: body?.data.map(({refinement}) => refinement),
                  name: '已精修',
                  type: 'bar',
                  stack: '标注',
                }, {
                  data: body?.data.map(({total}) => total),
                  name: '总数',
                  type: 'line',
                }];
              this.drawOrigin(xAxis, legend, series);
            }
          } else {
            this.noOriginData = true;
          }
        }).catch(() => this.noOriginData = true);
      },
      queryStatusTotal() {
        statisticsService.queryStatus().then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const legend = body.data.map(({status}) => status);
              const series = [
                {
                  name: '切片状态',
                  type: 'pie',
                  radius: '55%',
                  label: {
                    normal: {
                      formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                      backgroundColor: '#eee',
                      borderColor: '#aaa',
                      borderWidth: 1,
                      borderRadius: 4,
                      rich: {
                        a: {
                          color: '#999',
                          lineHeight: 22,
                          align: 'center',
                        },
                        hr: {
                          borderColor: '#aaa',
                          width: '100%',
                          borderWidth: 0.5,
                          height: 0,
                        },
                        b: {
                          fontSize: 16,
                          lineHeight: 33,
                        },
                        per: {
                          color: '#eee',
                          backgroundColor: '#334455',
                          padding: [2, 4],
                          borderRadius: 2,
                        },
                      },
                    },
                  },
                  center: ['50%', '60%'],
                  data: body.data.map(({status, count}) => ({name: status, value: count})),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }];
              this.drawStatus({
                data: legend,
                orient: 'vertical',
                left: 'left',
              }, series, 'status-echart');
            }
          } else {
            this.noStatusData = true;
          }
        }).catch(() => this.noStatusData = true);
      },
      queryDiagnoseTotal() {
        statisticsService.queryDiagnose().then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const legend = body.data.map(({diagnose}) => diagnose);
              const series = [
                {
                  name: '阴阳性',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  label: {
                    normal: {
                      formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                      backgroundColor: '#eee',
                      borderColor: '#aaa',
                      borderWidth: 1,
                      borderRadius: 4,
                      rich: {
                        a: {
                          color: '#999',
                          lineHeight: 22,
                          align: 'center',
                        },
                        hr: {
                          borderColor: '#aaa',
                          width: '100%',
                          borderWidth: 0.5,
                          height: 0,
                        },
                        b: {
                          fontSize: 16,
                          lineHeight: 33,
                        },
                        per: {
                          color: '#eee',
                          backgroundColor: '#334455',
                          padding: [2, 4],
                          borderRadius: 2,
                        },
                      },
                    },
                  },
                  data: body.data.map(({diagnose, count}) => ({name: diagnose, value: count})),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }];
              this.drawStatus({
                data: legend,
                orient: 'vertical',
                left: 'left',
              }, series, 'diagnose-echart');
            }
          } else {
            this.noDiagnoseData = true;
          }
        }).catch(() => this.noDiagnoseData = true);
      },
      queryCateTotal() {
        statisticsService.queryCate().then(({body}) => {
          if (body?.ret_code === 0) {
            if (body?.data?.length > 0) {
              const legend = body.data.map(({cate_name}) => cate_name);
              const series = [
                {
                  name: '分类',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: body.data.map(({cate_name, count}) => ({name: cate_name, value: count})),
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                  },
                }];
              this.drawStatus({
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: legend,
              }, series, 'cate-echart');
            }
          } else {
            this.noCateData = true;
          }
        }).catch(() => this.noCateData = true);
      },
      drawOrigin(xAxis, legend, series) {
        let originBar = echarts.init(document.getElementById('origin-echart'));
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
      drawStatus(legend, series, id) {
        let statusEchart = echarts.init(document.getElementById(id));
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: legend,
          series: series,
        };
        statusEchart.setOption(option);
      },

      handleClick(tab, event) {
        if (tab.name === '状态统计') {
          this.queryStatusTotal();
        }
        if (tab.name === '阴阳性统计') {
          this.queryDiagnoseTotal();
        }
        if (tab.name === '分类统计') {
          this.queryCateTotal();
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
