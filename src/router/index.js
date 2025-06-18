import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/emoji-app',
      name: '/emoji-app',
      component: () => import('@/views/emoji/emojiApp.vue'),
    },
    {
      path: '/emoji-app/emojiPngToGif',
      name: '/emoji-app/emojiPngToGif',
      component: () => import('@/views/emoji/emojiPngToGif.vue'),
    },
    {
      path: '/emoji-app/gifOverlayList',
      name: '/emoji-app/gifOverlayList',
      component: () => import('@/views/emoji/gifOverlayList/gifOverlayList.vue'),
    },
    {
      path: '/emoji-app/gifOverlayEditor',
      name: '/emoji-app/gifOverlayEditor',
      component: () => import('@/views/emoji/gifOverlayEditor.vue'),
    },
  ],
})

export default router
