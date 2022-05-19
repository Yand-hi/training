export const readingRoute = [{
  path: '/reading',
  component: () => import(/* webpackChunkName: "reading" */ './reading'),
  name: '阅片',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  isShow: true,
  children: [],
  meta: {
    activeMenu: '/reading'
  },
  icon: '../../../assets/img/menu/sys.png',
}];
