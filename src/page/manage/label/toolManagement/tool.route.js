export const toolRoute = [{
    path: 'tool',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/label/toolManagement/tool.route'),
    name: '标注工具管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
  },
 
  ];
