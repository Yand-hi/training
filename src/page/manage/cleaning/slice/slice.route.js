
export const sliceRoute = [{
    path: 'slice',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/cleaning/slice/slice.vue'),
    name: '切片清洗',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
