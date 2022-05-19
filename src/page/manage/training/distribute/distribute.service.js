import Vue from "vue";

import { baseUrl } from "@/config/utils";

/**
 * AI数据管理模块的服务
 * @class
 */
class DistributeService {

  //得到切片列表
  sliceList(params) {
    return Vue.http.get(`${baseUrl}/slice`, {params: params});
  }
  
  //分配切片
  distributeSlice(data) {
    return Vue.http.post(`${baseUrl}/slice/assign`, data);
  }
  
  //删除切片
  deleteSlice(params) {
      return Vue.http.delete(`${baseUrl}/slice`, params);
  }
  
  //目录列表
  folderList(params) {
    return Vue.http.get(`${baseUrl}/folder`, {params: params});
  }

  //切片类别
  sliceType(params) {
    return Vue.http.get(`${baseUrl}/slice/type`, {params: params});
  }
   
  //集详情
  getFolderInfo(params) {
    return Vue.http.get(`${baseUrl}/folder/statistics`, { params: params });
  }

    
}

const distributeService = new DistributeService();

export { distributeService };
