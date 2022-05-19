import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 数据统计模块的服务
 * @class
 */
class StatisticsService {
  /**
   * @constructor
   */
  constructor() {
  }


  /**
   * 切片来源统计
   * @return {Promise}
   */
  queryTotal(params) {
    return Vue.http.get(`${baseUrl}/statistic/total`, {params});
  }

  /**
   * 状态统计
   * @return {Promise}
   */
  queryStatus(params) {
    return Vue.http.get(`${baseUrl}/statistic/status`, {params});
  }

  /**
   * 阴阳性
   * @return {Promise}
   */
  queryDiagnose(params) {
    return Vue.http.get(`${baseUrl}/statistic/diagnose`, {params});
  }

  /**
   * 分类统计
   * @return {Promise}
   */
  queryCate(params) {
    return Vue.http.get(`${baseUrl}/statistic/cate`, {params});
  }

  queryNewSlice(params) {
    return Vue.http.get(`${baseUrl}/statistic/new`, {params});
  }

  queryNewDiagnose(params) {
    return Vue.http.get(`${baseUrl}/statistic/new_diagnose`, {params});
  }

  queryNewStatus(params) {
    return Vue.http.get(`${baseUrl}/statistic/new_status`, {params});
  }

}

const statisticsService = new StatisticsService();

export {statisticsService};
