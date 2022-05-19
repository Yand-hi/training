export const taskRoute = [
  {
    path: "task",
    component: () => import(/* webpackChunkName: "AI-task" */ "./task"),
    name: "任务管理",
    beforeEnter: (to, from, next) => {
      next();
    },
    // redirect: '/manage',
    children: [],
    icon: "assets/img/menu/origin.png"
  },
  {
    path: "task/add",
    name: "创建任务",
    isShow: false,
    notShow: true,
    meta: {
      activeMenu: '/training/task'
    },
    component: () =>
      import(/* webpackChunkName: "scanner-expand-test" */ "./newTask.vue")
  },
  {
    path: "task/reading",
    name: "查看任务",
    isShow: false,
    notShow: true,
    meta: {
      activeMenu: '/training/task'
    },
    component: () =>
      import(/* webpackChunkName: "scanner-expand-test" */ "./taskDetail.vue")
  },
];
