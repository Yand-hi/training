import Vue from "vue";

import { baseUrl } from "@/config/utils";

/**
 * AI数据管理模块的服务
 * @class
 */
class EstimateService {
  getConfigList(params) {
    return Vue.http.get(`${baseUrl}/config`, { params: params });
  }

  getEvaluateHistory(params) {
    return Vue.http.get(`${baseUrl}/task/evalute`, { params: params });
  }

  commitEvaluate(body) {
    return Vue.http.post(`${baseUrl}/task/evalute/store`, body);
  }
}

const estimateService = new EstimateService();

export { estimateService };
