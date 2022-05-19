export const modelRoute = [{
    path: 'model',
    component: () => import(/* webpackChunkName: "user" */ '@/page/manage/system/model/model'),
    name: '模型配置',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
  }];
  