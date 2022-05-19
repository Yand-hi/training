export const collocateRoute = [{
    path: 'collocate',
    component: () => import(/* webpackChunkName: "AI-collocate" */ './collocate'),
    name: '配置管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  }];
  