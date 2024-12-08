import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'fund',
      component: () => import('@/views/index.ts').then((res) => res.tabsComp),
      meta: {
        title: 'fund',
      },
    },
  ],
});

export default router;
