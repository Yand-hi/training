import Vue from 'vue';
import {baseUrl} from '@/config/utils';

export default class historyService{
  static getHistory(params){
    return Vue.http.get(`${baseUrl}/scanistor?is_history=1`, {params} );
  }
  static getScanSlice(params){
    return Vue.http.get(`${baseUrl}/scanistor/slice/page`, {params} );
  }
}
