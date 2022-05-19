
export const expandRoute = [{
    path: 'expand',
    component:  () => import(/* webpackChunkName: "scanner-expand" */ '@/page/manage/scanner/expand/expand.vue'),
    name: '拓扑',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  },
  {
    path: 'scanAdjust',
    name: 'adjustSlice',
    notShow: true,
    meta: {
      activeMenu: '/scanner/expand'
    },
    component:  () => import(/* webpackChunkName: "scanner-expand-test" */ '@/page/manage/scanner/expand/adjustSlide.vue'),
  },
  {
    path: 'scanDetails',
    name: 'scanDetails',
    notShow: true,
    meta: {
      activeMenu: '/scanner/expand'
    },
    component:  () => import(/* webpackChunkName: "scanner-details-test" */ '@/page/manage/scanner/expand/details.vue'),
  },
  {
    path: 'viewSlice',
    name: 'viewSlice',
    notShow: true,
    meta: {
      activeMenu: '/reading'
    },
    component:  () => import(/* webpackChunkName: "scanner-view-slice" */ '@/page/manage/scanner/expand/viewSlice.vue'),
  }
  ];
