export const trainingSetRoute = [{
    path: 'trainingSet',
    component: () => import(/* webpackChunkName: "AI-trainingSet" */ '@/page/manage/training/trainingSet/trainingSet.vue'),
    name: '训练集管理',
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: 'assets/img/menu/origin.png',
  }];
