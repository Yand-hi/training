import ElementUI from 'element-ui';
import { Table, TableColumn } from "element-ui";
import '@/style/element-variables.scss';
import Vue from 'vue'

export default {
  install() {
    Vue.use(ElementUI);
    Vue.use(Table);
    Vue.use(TableColumn);
  }
}
