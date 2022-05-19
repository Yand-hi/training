export const workloadRoute = [{
  path: 'workload',
  component: () => import(/* webpackChunkName: "statistics-workload" */ './workload'),
  name: '工作量统计',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: '',
}];
