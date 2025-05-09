import type {RouteRecordRaw} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/IndexPage.vue')},
      {
        path: '/module',
        children: [
          {path: 'home', component: () => import('pages/IndexPage.vue')},
          {path: 'form/:module', component: () => import('pages/ModuleFormPage.vue')},
          {path: 'model/:module', component: () => import('pages/ModuleModelPage.vue')},
        ],
      },
      {
        path: '/model',
        children: [
          {path: 'home', component: () => import('pages/IndexPage.vue')},
          {path: 'form/:module/:model', component: () => import('pages/ModelFormPage.vue')},
          {path: 'attr/:module/:model', component: () => import('pages/ModelAttrPage.vue')},
        ],
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
