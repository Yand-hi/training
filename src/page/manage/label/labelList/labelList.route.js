export const labelListRoute = [{
    path: 'labeling',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/label/labelList/labelList.route'),
    name: '标注精修列表',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
  },
 
  ];
