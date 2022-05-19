
export const sliceRoute = [{
    path: 'slice',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/file/slice/slice.vue'),
    name: '已入库切片管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
