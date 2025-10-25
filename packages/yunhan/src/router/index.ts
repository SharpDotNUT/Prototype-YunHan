import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router';
import Home from '@/views/home.vue';
import { YaeRoutes } from './yae';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue' as any)
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/index.vue'),
    children: [
      {
        path: '',
        name: 'settings-home',
        redirect: '/settings/general'
      },
      {
        path: 'general',
        component: () => import('@/views/settings/General/index.vue')
      },
      {
        path: 'rm',
        component: () => import('@/views/settings/RM/index.vue')
      },
      {
        path: 'about',
        component: () => import('@/views/settings/about/index.vue')
      },
      {
        path: 'update-log',
        component: () => import('@/views/settings/update_log/index.vue')
      }
    ]
  },
  {
    name: 'translator',
    path: '/translator',
    component: () => import('@/views/translator/index.vue')
  },
  {
    name: 'music-player',
    path: '/music-player',
    component: () => import('@/views/music-player/index.vue' as any)
  },
  {
    name: 'question',
    path: '/quiz',
    component: () => import('@/views/question/index.vue' as any),
    children: [
      {
        path: '',
        component: () => import('@/views/question/home.vue')
      },
      {
        path: 'answer',
        component: () => import('@/views/question/answer.vue')
      },
      {
        path: 'result',
        component: () => import('@/views/question/result.vue' as any)
      }
    ]
  },
  {
    name: 'achievement',
    path: '/achievement',
    component: () => import('@/views/achievement/index.vue')
  },
  {
    name: 'gacha-view',
    path: '/gacha/view',
    component: () => import('@/views/gacha/view/index.vue' as any)
  },
  {
    name: 'gacha-simulator',
    path: '/gacha/simulator',
    component: () => import('@/views/gacha/simulator/index.vue' as any)
  },
  {
    name: 'gacha-data',
    path: '/gacha/data',
    component: () => import('@/views/gacha/data/index.vue')
  },
  {
    name: 'dictionary',
    path: '/dictionary',
    component: () => import('@/views/dictionary/index.vue'),
    children: [
      {
        name: 'dictionary-home',
        path: '',
        component: () => import('@/views/dictionary/home.vue')
      },
      {
        name: 'dictionary-main',
        path: 'main',
        component: () => import('@/views/dictionary/main.vue')
      },
      {
        name: 'dictionary-editor',
        path: 'editor',
        component: () => import('@/views/dictionary/editor/index.vue')
      }
    ]
  },
  {
    name: 'tqrt',
    path: '/tqrt',
    component: () => import('@/views/tqrt/index.vue')
  },
  {
    name: 'sp-key',
    path: '/sp-key',
    component: () => import('@/views/sp-key/index.vue')
  },
  {
    name: 'init',
    path: '/init',
    component: () => import('@/views/init/index.vue')
  },
  {
    name: 'emotion',
    path: '/emotion',
    component: () => import('@/views/emotion/index.vue')
  },
  YaeRoutes
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

export default router;
