import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 解决报错
const originalPush = Router.prototype.push
const originalReplace = Router.prototype.replace
// // push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
// // replace
// Router.prototype.replace = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
//   return originalReplace.call(this, location).catch(err => err)
// }
/**
 * vue-router的辅助类，用来动态添加路由
 * @class
 */
class RouterHelperProvider {
  /**
   * @constructor
   */
  constructor() {
    this.hasOtherwise = false;
    this.router = new Router({
      mode: 'history',
      strict: process.env.NODE_ENV !== 'production',
    });
  }

  /**
   *
   * @param {Array} routes  要添加的路由数组
   * @param {string} [root]  根页面重定向的路由地址
   * @param {string} [notFind] 404页面重定向的路由地址
   */
  configureRoutes(routes, root, notFind) {
    this.router.addRoutes(routes);
    if (root && !this.hasOtherwise) {
      this.hasOtherwise = true;
      this.router.addRoutes([
        {path: '/', redirect: root},
        {path: '*', redirect: notFind},
      ]);
    }
  }

  /**
   * @param {RouterHelperProvider~requestCallback} callback 路由错误时的回调函数
   */
  routesError(callback) {
    callback();
  }
}

const routerHelperProvider = new RouterHelperProvider();
const router = routerHelperProvider.router;
/**
 * @callback RouterHelperProvider~requestCallback
 */
routerHelperProvider.routesError(() => {
  router.onError(() => {
   router.push('/error');
  });
});

export {routerHelperProvider, router};


