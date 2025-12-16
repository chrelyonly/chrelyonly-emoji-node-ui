import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    // },
    {
      path: '/',
      name: '/',
      component: () => import('@/views/emoji/emojiApp.vue'),
    },
    {
      path: '/gifOverlay/emojiPngToGif',
      name: '/gifOverlay/emojiPngToGif',
      component: () => import('@/views/emoji/gifOverlay/emojiPngToGif.vue'),
    },
    {
      path: '/christmas/christmas',
      name: '/christmas/christmas',
      component: () => import('@/views/emoji/christmas/christmas.vue'),
    },
    {
      path: '/gifOverlay/gifOverlayList',
      name: '/gifOverlay/gifOverlayList',
      component: () => import('@/views/emoji/gifOverlay/gifOverlayList.vue'),
    },
    {
      path: '/gifOverlay/gifOverlayEditor',
      name: '/gifOverlay/gifOverlayEditor',
      component: () => import('@/views/emoji/gifOverlay/gifOverlayEditor.vue'),
    },
  ],
})

export default router
