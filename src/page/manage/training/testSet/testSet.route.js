export const testSetRoute = [{
    path: 'testSet',
    component: () => import(/* webpackChunkName: "AI-testSet" */ '@/page/manage/training/testSet/testSet.vue'),
    name: '测试集管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  }];
  