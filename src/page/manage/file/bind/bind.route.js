
export const bindRoute = [{
    path: 'bind',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/file/bind/bind.vue'),
    name: '切片绑定管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
 
  ];
