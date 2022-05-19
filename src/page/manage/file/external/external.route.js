
export const externalRoute = [{
    path: 'external',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/file/external/external.vue'),
    name: '外部切片入库',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
