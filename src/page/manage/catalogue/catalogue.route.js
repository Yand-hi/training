export const catalogueRoute = [{
  path: '/catalogue',
  component: () => import(/* webpackChunkName: "training" */ './catalogue'),
  name: '目录管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/file',
  children: [],
  icon: '../../../../assets/img/menu/catalogue.png',
},

];
