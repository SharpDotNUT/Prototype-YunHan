import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue' as any)
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/home.vue' as any)
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/index.vue' as any),
    children: [
      {
        path: '',
        name: 'settings-home',
        redirect: '/settings/general'
      },
      {
        path: 'general',
        component: () => import('../views/settings/General/index.vue' as any)
      },
      {
        path: 'rm',
        component: () => import('../views/settings/RM/index.vue' as any)
      }
    ]
  },
  {
    path: '/update-log',
    name: 'update-log',
    component: () => import('../views/update_log/index.vue' as any)
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/about/index.vue' as any)
  },
  {
    name: 'translator',
    path: '/translator',
    component: () => import('../views/translator/index.vue' as any)
  },
  {
    name: 'music-player',
    path: '/music-player',
    component: () => import('../views/music-player/index.vue' as any)
  },
  {
    name: 'question',
    path: '/quiz',
    component: () => import('../views/question/index.vue' as any),
    children: [
      {
        path: '',
        component: () => import('../views/question/home.vue' as any)
      },
      {
        path: 'answer',
        component: () => import('../views/question/answer.vue' as any)
      },
      {
        path: 'result',
        component: () => import('../views/question/result.vue' as any)
      }
    ]
  },
  {
    name: 'achievement',
    path: '/achievement',
    component: () => import('../views/achievement/index.vue' as any)
  },
  {
    name: 'gacha-view',
    path: '/gacha/view',
    component: () => import('../views/gacha/view/index.vue' as any)
  },
  {
    name: 'gacha-simulator',
    path: '/gacha/simulator',
    component: () => import('../views/gacha/simulator/index.vue' as any)
  },
  {
    name: 'dictionary',
    path: '/dictionary',
    component: () => import('../views/dictionary/index.vue' as any),
    children: [
      {
        name: 'dictionary-home',
        path: '',
        component: () => import('../views/dictionary/home.vue' as any)
      },
      {
        name: 'dictionary-main',
        path: 'main',
        component: () => import('../views/dictionary/main.vue' as any)
      }
    ]
  },
  {
    name: 'sp-key',
    path: '/sp-key',
    component: () => import('../views/sp-key/index.vue' as any)
  }
]

const router = createRouter({
  //@ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
