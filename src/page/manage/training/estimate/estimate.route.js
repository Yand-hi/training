export const estimateRoute = [{
    path: 'estimate',
    component: () => import(/* webpackChunkName: "AI-estimate" */ './estimate'),
    name: '评估管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  }];
  