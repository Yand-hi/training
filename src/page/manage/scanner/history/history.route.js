export const historyRoute = [{
    path: 'history',
    component: () => import(/* webpackChunkName: "scanner-history" */ './history'),
    name: '历史溯源',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
  {
    path: 'historyDetails',
    name: '查看详情',
    notShow: true,
    meta: {
      activeMenu: '/scanner/history'
    },
    // isHidden: false,
    component:  () => import(/* webpackChunkName: "scanner-expand-test" */ './historyDetails'),
  },
  ];
