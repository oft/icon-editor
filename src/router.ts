import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'
import 'virtual:uno.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          name: 'home',
          component: ()=>import( './views/HomeView.vue')
        },
        {
          path: 'icons/:collectionName?',
          name: 'icons',
          component: ()=>import( './views/IconsView.vue'),
          props: true
        },
        {
          path: 'about',
          name: 'about',
          component: ()=>import( './views/AboutView.vue')
        }
      ]
    }
  ]
})

export default router
