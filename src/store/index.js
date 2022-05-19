import Vue from 'vue';
import Vuex from 'vuex';
import {stompModule} from '../service/stomp.store';
import {loginService} from '../page/base/login/login.service'
import Cookie from 'js-cookie';
Vue.use(Vuex);

const state = {
  urlList: [],
  menus: [],
  isLogin: false,
  user: {},
  info: {},
  collapse: document.body.clientWidth > 1400 ? false : true,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setURL(state, list) {
    state.urlList = list;
  },
  setMenus(state, menus) {
    state.menus = menus;
  },
  isLogin(state, status) {
    state.isLogin = status;
  },
  setCollapse(state, collapse) {
    state.collapse = collapse;
  },
  setTask(state, task) {
    state.task = task;
  },
  setFolderID(state, folder_id) {
    state.folder_id = folder_id;
  },
  setInfo(state, info) {
    state.info = info;
  },
};

const actions = {
  getSSOToken({commit}) {
    loginService.authSSOToken().then((res) => {
      if (res.body.ret_msg) {
        Cookie.set('DD_TOKEN', res.body.ret_msg, {  domain: '.hzztai.com' });
      }
    });
  },
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    stomp: stompModule,
  },
});
