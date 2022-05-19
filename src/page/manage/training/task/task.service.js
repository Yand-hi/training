import Vue from "vue";

import { baseUrl } from "@/config/utils";

/**
 * AI任务管理模块的服务
 * @class
 */
class TaskService {

  //得到任务列表
  taskList(params) {
    return Vue.http.get(`${baseUrl}/task`, {params: params});
  }
  
  //任务详情
  taskDetail(params) {
    return Vue.http.get(`${baseUrl}/task/info`, {params: params});
  }
  
  //新增任务
  addTask(params) {
      return Vue.http.post(`${baseUrl}/task/store`, params);
  }
  
  //删除任务
  deleteTask(body) {
      return Vue.http.delete(`${baseUrl}/task`, {body});
  }
  
  //开始学习
  startStudy(body) {
      return Vue.http.post(`${baseUrl}/task/study`, body);
  }
  
  //获取病理分类
  getSliceType(params) {
    return Vue.http.get(`${baseUrl}/slice/type`, {params: params});
  }
  
  //获取模型分类
  getModelType(params) {
    return Vue.http.get(`${baseUrl}/model/type`, {params: params});
  }
  
  //获取模型名称
  getModelName(params) {
    return Vue.http.get(`${baseUrl}/model/name/select`, {params: params});
  }
  
  //获取模型参数
  getModelParams(params) {
    return Vue.http.get(`${baseUrl}/param/list`, {params: params});
  }
  
  //获取模型历史配置
  getModelHistory(params) {
    return Vue.http.get(`${baseUrl}/task/history/by/model/name`, {params: params});
  }
  
  //评估指标
  getEvaluate() {
    return Vue.http.get(`${baseUrl}/evalute/index/list`);
  }
  
  //集详情
  getFolderInfo(params) {
    return Vue.http.get(`${baseUrl}/folder/statistics`, { params: params });
  }

  //目录列表
  folderList(params) {
    return Vue.http.get(`${baseUrl}/folder`, {params: params});
  }
  
  //任务详情
  taskDetail(params) {
    return Vue.http.get(`${baseUrl}/task/info`, {params: params});
  }
  

}

const taskService = new TaskService();

export { taskService };
