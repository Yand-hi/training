
export const checkListRoute = [{
    path: 'checking',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/label/checkList/checkList.route'),
    name: '审核列表',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
  },
 
  ];
