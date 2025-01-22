import { createRouter, createWebHistory } from 'vue-router'
import IndeDialogBox from '@/views/IndeDialogBox.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndeDialogBox,
    },
    {
      path: '/inline',
      name: 'inline',
      component: () => import('@/views/InlineDialogBox.vue'),
    },
  ],
})

export default router
