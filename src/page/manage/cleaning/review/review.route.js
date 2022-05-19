
export const reviewRoute = [{
    path: 'review',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/cleaning/review/review.vue'),
    name: '审核列表',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
