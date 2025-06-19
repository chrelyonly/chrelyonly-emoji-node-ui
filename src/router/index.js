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
      path: '/emoji-app/gifOverlay/gifOverlayList',
      name: '/emoji-app/gifOverlay/gifOverlayList',
      component: () => import('@/views/emoji/gifOverlay/gifOverlayList.vue'),
    },
    {
      path: '/emoji-app/gifOverlay/gifOverlayEditor',
      name: '/emoji-app/gifOverlay/gifOverlayEditor',
      component: () => import('@/views/emoji/gifOverlay/gifOverlayEditor.vue'),
    },
  ],
})

export default router
