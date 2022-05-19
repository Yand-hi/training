
import {distributeRoute} from "./distribute/distribute.route";
import {trainingSetRoute} from "./trainingSet/trainingSet.route";
import {testSetRoute} from "./testSet/testSet.route";
import {taskRoute} from "./task/task.route";
import {collocateRoute} from "./collocate/collocate.route";
import {estimateRoute} from "./estimate/estimate.route";


export const trainingRoute = [{
  path: '/training',
  component: () => import(/* webpackChunkName: "training" */ './training'),
  name: 'AI管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [
      ...distributeRoute,
      ...trainingSetRoute,
      ...testSetRoute,
      ...taskRoute, 
      ...collocateRoute, 
      ...estimateRoute
    ],
  icon: '../../../../assets/img/menu/train.png',
}];
