import {labelListRoute} from "./labelList/labelList.route";
import {checkListRoute} from "./checkList/checkList.route";
import {distributeLableRoute} from "./distributeLable/distribute.route";

export const labelRoute = [
  {
    path: "/label",
    component: () => import(/* webpackChunkName: ";label" */ "./label"),
    name: "标注管理",
    beforeEnter: (to, from, next) => {
      next();
    },
    children: [
      ...distributeLableRoute,
      ...labelListRoute,
      ...checkListRoute,
    ],
    icon: "../../../../assets/img/menu/label.png"
  }
];
