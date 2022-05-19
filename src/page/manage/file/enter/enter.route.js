
export const enterRoute = [{
    path: 'enter',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/file/enter/enter.vue'),
    name: '外部切片入库',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
