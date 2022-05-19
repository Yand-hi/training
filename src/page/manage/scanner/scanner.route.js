import {expandRoute} from "./expand/expand.route";
import {historyRoute} from "./history/history.route";

export const scannerRoute = [{
  path: '/scanner',
  component: () => import(/* webpackChunkName: "scanner" */ './scanner'),
  name: '扫描仪监控管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [
    ...expandRoute, 
    ...historyRoute
    ],
  icon:'../../../../assets/img/menu/scan.png',
}];
