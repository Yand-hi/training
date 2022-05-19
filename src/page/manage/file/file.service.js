import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class FileService {
  constructor() {

  }

  //得到切片列表
  sliceList(params) {
    return Vue.http.get(`${baseUrl}/pathology_list`, {params: params});
  }

  // 标记未知切片
  markUnknown(params) {
    return Vue.http.post(`${baseUrl}/mark_unknown`, params);
  }

  // 同步
  syncSlice(body) {
    return Vue.http.post(`${baseUrl}/sync/pathology`, body);
  }

  // 绑定
  bindSlice(body) {
    return Vue.http.post(`${baseUrl}/slice_bind`, body);
  }

      //删除切片
  deleteSlice(params) {
    return Vue.http.delete(`${baseUrl}/slice`,{params: params});
}

  //检查项目列表
  libraryList() {
    return Vue.http.get(`${baseUrl}/library/name`);
  }

  //得到分类列表
  originList() {
    return Vue.http.get(`${baseUrl}/source`);
  }

  // 创建上传任务
  uploadTask(body) {
    return Vue.http.post(`${baseUrl}/upload/task`, body)
  }

  // 获取任务列表
  taskList(params) {
    return Vue.http.get(`${baseUrl}/upload/task`, {params: params});
  }

  // 上传切片
  uploadSlice(body) {
    return Vue.http.post(`${baseUrl}/kfb/upload`, body)
  }

  // 切片进度列表
  progressList(params) {
    return Vue.http.get(`${baseUrl}/upload/task/slides`, {params: params})
  }

}

const fileService = new FileService();
export {fileService}
