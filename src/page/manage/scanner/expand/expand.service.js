import Vue from 'vue';
import {baseUrl} from '@/config/utils';

export default class expandService{
  static getScan(params){
    return Vue.http.get(`${baseUrl}/scanistor?is_history=0`, {params} );
  }
  static addScan(params){
    return Vue.http.post(`${baseUrl}/scanistor`, params );
  }
  static deleteScan(params){
    return Vue.http.delete(`${baseUrl}/scanistor/${params}`);
  }
  static getScanDetail(params){
    return Vue.http.get(`${baseUrl}/scanistor/detail`,  {params} );
  }
}
