import Vue from "vue";
import { baseUrl } from "@/config/utils";

export default class testSetService {
  static getMenu() {
    return Vue.http.get(`${baseUrl}/folder`);
  }
  static getFolderInfo(params) {
    return Vue.http.get(`${baseUrl}/folder/statistics`, { params: params });
  }
  static addMenu(params) {
    return Vue.http.post(`${baseUrl}/folder`, params);
  }
  static sliceList(params) {
    return Vue.http.get(`${baseUrl}/slice`, { params: params });
  }
  static sliceType(params) {
    return Vue.http.get(`${baseUrl}/slice/type`, { params: params });
  }
  static deleteMenu(body) {
    return Vue.http.delete(`${baseUrl}/folder`, { body });
  }
  static removeSlice(body) {
    return Vue.http.post(`${baseUrl}/remove/folder/slice`, body);
  }
}
