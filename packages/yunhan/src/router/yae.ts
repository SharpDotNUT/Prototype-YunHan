import type { RouteRecordRaw } from 'vue-router';

export const YaeRoutes: RouteRecordRaw = {
  path: '/yaedou',
  name: 'Yae',
  component: () => import('@/views/yaedou/index.vue')
};
