import ComponentPlugin from './components'
import Vue from 'vue'

export default {
  install() {
    Vue.use(ComponentPlugin);
  }
}
