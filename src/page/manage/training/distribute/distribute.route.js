export const distributeRoute = [{
    path: 'distribute',
    component: () => import(/* webpackChunkName: "AI-distribute" */ './distribute'),
    name: '数据管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  }];
  