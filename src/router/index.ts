import { createRouter, createWebHashHistory } from 'vue-router'
import IndeDialogBox from '@/views/IndeDialogBox.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: IndeDialogBox,
      children: [
        {
          path: '',
          name: 'init',
          component: () => import('@/views/IndeInit.vue'), // 默认显示内容组件
        },
        {
          path: '/chat/:conversationdId?', // 注意参数名与代码一致
          name: 'chat',
          component: () => import('@/views/ChatView.vue'),
          props: true, // 自动传递路由参数
        },
      ],
    },
    {
      path: '/inline',
      name: 'inline',
      component: () => import('@/views/InlineDialogBox.vue'),
    },
  ],
})

export default router
