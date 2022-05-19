
import Vue from "vue";

import { baseUrl } from "@/config/utils";

/**
 * AI数据管理模块的服务
 * @class
 */
class CollocateService {

  getConfigList(params) {
    return Vue.http.get(`${baseUrl}/config`, { params: params });
  }
  
  addConfig(params) {
    return Vue.http.post(`${baseUrl}/config/store`, params);
  }
  
  deleteConfig(id) {
    return Vue.http.delete(`${baseUrl}/config/${id}`);
  }
    
}

const collocateService = new CollocateService();

export { collocateService };
