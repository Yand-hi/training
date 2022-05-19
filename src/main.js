import './polyfill';
import Vue from 'vue';

import App from './App';
import {baseRoutes,clearLoginInfo} from './config/utils';
import {httpHelperProvider} from './config/http';
import {router} from './router/';
import store from './store/';
import Plugins from '@/plugins/index.js'
import { loginService } from './page/base/login/login.service';
import Cookie from 'js-cookie';

isLogin().finally(() => {
  // 加载路由页面
  baseRoutes.forEach(name => require(`./page/base${name}${name}.route`));
  require(`./page/manage/manage.route`);
  Vue.use(Plugins);
  Vue.config.productionTip = false;

  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App},
  });
});

/**
 * 进行http request拦截，在请求之间做一些操作
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.request(function (request) {
  // console.log(request);
});

/**
 * 进行http response拦截，在处理返回之前做通用的操作处理
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.response(function (response) {
  if (response.status === 401 || response.body.ret_code === 401) {
    window.sessionStorage.removeItem('accessToken');
    router.replace('/login');
    store.commit('isLogin', false);
  }
});

/**
 * 判断是否有权限进入特定的页面
 */
router.beforeEach((to, from, next) => {
  // console.log(to);
  if (store.state.isLogin && (to.path === '/error' || to.path === '/login' || to.path === '/')) {
    if (from.path === '/error' || from.path === '/login' || from.path === '/' || from.path === '/404') {
      next('/manage');
    }else {
      next(false);
    }
    return;
  }else if (/.*(code)=(\w+)[&|?|%26]\w*/g.test(to.fullPath)) { // 如果路由里有code说明是钉钉重定向的路由，直接登录
    const code = RegExp.$2;
    loginService.ddLogin({code}).then((res) => {
      // console.log(res);
      window.sessionStorage.clear();
      if (res.body.ret_code ===0) {
        store.commit('isLogin', true);
        store.commit('setURL', baseRoutes);
        store.commit('setUser', res.body.data.user);
        window.sessionStorage.setItem('accessToken',
          res.body.data.access_token);
        window.sessionStorage.setItem('user',
          JSON.stringify(res.body.data.user));
        httpHelperProvider.setHeaders([{
          'Authorization': `${res.body.data.access_token}`,
        }]);
        store.dispatch('getSSOToken');
        next({
          path: to.query?.redirect || to.path || '/manage',
        });
      } else {
        
      }
    }).catch((e) => {
      console.log(e);
      clearLoginInfo();
      next({
        path: '/login',
      });
    });
  }else if (Cookie.get('DD_TOKEN') && (to.path === '/error' || to.path === '/login' || to.path === '/')) { // 如果cookie里有DD_TOKEN且没有过期，直接登录
    loginService.ssoLogin({
      sso_token: Cookie.get('DD_TOKEN'),
    }).then((res) => {
      window.sessionStorage.clear();
      if (res.body.ret_code ===0) {
        store.commit('isLogin', true);
        store.commit('setURL', baseRoutes);
        store.commit('setUser', res.body.data.user);
        window.sessionStorage.setItem('accessToken',
          res.body.data.access_token);
        window.sessionStorage.setItem('user',
          JSON.stringify(res.body.data.user));
        httpHelperProvider.setHeaders([{
          'Authorization': `${res.body.data.access_token}`,
        }]);
        next({
          path: to.query?.redirect || '/manage',
        })
      } else {
        
      }
    }).catch((e) => {
      console.log(e);
      clearLoginInfo();
      next({
        path: '/login',
        query: {
          ...to.query,
          redirect: to.fullPath,
        },
      });
    });
  }
  next(true);
  /* if (store.state.urlList.find((uri) => ~to.path.indexOf(uri))) {
    next(true);
  } else {
    next('/404');
  }*/
});

/**
 * 判断是否登录
 */
async function isLogin() {
  store.commit('setURL', baseRoutes);
  if (window.sessionStorage.getItem('accessToken')) {
    store.commit('setMenus', []);
    store.commit('isLogin', true);
  } else {
    // router.push('/login');
    store.commit('isLogin', false);
  }
}


