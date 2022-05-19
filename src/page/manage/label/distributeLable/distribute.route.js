export const distributeLableRoute = [{
    path: 'distribute',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/label/distributeLable/distribute.route'),
    name: '分配管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
  },
 
  ];
