export const uploadRoute = [{
  path: '/upload',
  component: () => import(/* webpackChunkName: "upload" */ './upload'),
  name: '数据上传',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/entry.png',
}];
