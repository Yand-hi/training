export const toolRoute = [{
    path: 'tool',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/system/toolManagement/tool'),
    name: '分库及标注工具管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
  },
 
  ];
