export const totalRoute = [{
  path: 'total',
  component: () => import(/* webpackChunkName: "statistics-total" */ './total'),
  name: '切片总量统计',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: '',
}];
