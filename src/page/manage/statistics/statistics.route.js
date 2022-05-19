import {totalRoute} from './total/total.route';
import {workloadRoute} from './workload/workload.route';

export const statisticsRoute = [{
  path: '/statistics',
  component: () => import(/* webpackChunkName: "statistics" */ './statistics'),
  name: '统计管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [...totalRoute, ...workloadRoute],
  icon: '../../../../assets/img/menu/statistics.png',
}];
