import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 诊断管理模块的服务
 * @class
 */
export default class AppService {
  static getDDid() {
    return Vue.http.get(`${baseUrl}/setting/dingding`);
  }
  
}

const appService = new AppService();

export {appService};