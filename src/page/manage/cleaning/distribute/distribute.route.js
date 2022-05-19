
export const distributeRoute = [{
    path: 'distribute',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/cleaning/distribute/distribute.vue'),
    name: '分配管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
