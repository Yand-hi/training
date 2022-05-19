
import {distributeRoute} from "./distribute/distribute.route";
import {reviewRoute} from "./review/review.route";
import { sliceRoute } from "./slice/slice.route";


export const cleaningRoute = [{
  path: '/cleaning',
  component: () => import(/* webpackChunkName: "training" */ './cleaning'),
  name: '数据清洗',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/cleaning',

  children: [
      ...distributeRoute,
      ...reviewRoute,
      ...sliceRoute
  ],
  icon: '../../../../assets/img/menu/clean.png',
},

];
