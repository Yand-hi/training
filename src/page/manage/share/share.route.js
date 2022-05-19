export const shareRoute = [{
  path: '/share',
  component: () => import(/* webpackChunkName: "share" */ './share'),
  name: '分享列表',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/share.png',
}];
