import Vue from 'vue';
import {baseUrl} from '@/config/utils';
class SliceService {
  constructor() {}
  //得到分类列表
  cateList(params) {
    return Vue.http.get(`${baseUrl}/slice_count`, { params });
  }
  //得到切片列表
  sliceList(params) {
    return Vue.http.get(`${baseUrl}/slice`, { params: params });
  }
  //得到分享列表
  shareList(params) {
    return Vue.http.get(`${baseUrl}/share/list`, { params: params });
  }
  //删除切片
  deleteSlice(params) {
    return Vue.http.put(`${baseUrl}/slice`, params);
  }
  //查看病例信息
  pathologyMessages(pathology_id) {
    return Vue.http.get(`${baseUrl}/pathology/${pathology_id}`);
  }
  //下载图片
  downloadJSON(params) {
    return Vue.http.get(`${baseUrl}/download/labels`, { params: params });
  }
  // 新增、修改分享
  sliceShare(params) {
    return Vue.http.post(`${baseUrl}/share/store`, params);
  }
  // 取消分享切片
  sliceUnShare(params) {
    return Vue.http.put(`${baseUrl}/share/cancel`, params);
  }
  // 关联切片
  sliceUpdate(params) {
    return Vue.http.put(`${baseUrl}/slice_update`, params);
  }

  batchDelete(params) {
    return Vue.http.delete(`${baseUrl}/slice`, { params: params });
  }

  sliceDuplicate(params) {
    return Vue.http.get(`${baseUrl}/slice_duplicate`, { params: params });
  }

  relateJSON(params) {
    return Vue.http.post(`${baseUrl}/relate_json`, params);
  }
  /**
   * 用户列表接口
   * @return {Promise}
   */
  userList() {
    return Vue.http.get(`${baseUrl}/user`);
  }
}
const sliceService = new SliceService();

export {sliceService};
