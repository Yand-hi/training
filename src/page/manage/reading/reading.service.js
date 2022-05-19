import Vue from 'vue';
import {baseUrl} from '@/config/utils';

export default class readingService{
  static sliceList(params) {
    return Vue.http.get(`${baseUrl}/slice`, { params: params });
  }
  static sliceBind(params) {
    return Vue.http.post(`${baseUrl}/slice_bind`,  params );
  }
  static deleteSlice(params) {
    return Vue.http.delete(`${baseUrl}/slice`, { params: params } );
  }
}
