
import {bindRoute} from "./bind/bind.route";
import {sliceRoute} from "./slice/slice.route";
import {enterRoute} from "./enter/enter.route";


export const fileRoute = [{
  path: '/file',
  component: () => import(/* webpackChunkName: "training" */ './file'),
  name: '文件入库管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/file',

  children: [
      ...enterRoute,
      ...bindRoute,
      ...sliceRoute,
  ],
  icon: '../../../../assets/img/menu/file.png',
},

];
