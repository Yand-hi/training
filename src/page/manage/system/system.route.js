import {userRoute} from "./user/user.route";
import {modelRoute} from "./model/model.route";
import {toolRoute} from "./toolManagement/tool.route";


export const systemRoute = [{
  path: '/system',
  component: () => import(/* webpackChunkName: "system" */ './system'),
  name: '系统管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/system/tool',
    children: [
        // ...scanRoute,
        // ...classifyRoute,
        // ...originRoute,
        ...toolRoute,
        ...modelRoute,
        ...userRoute,
    ],
  icon: '../../../../assets/img/menu/system.png',
}];
