import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'
import HomeView from './views/HomeView.vue'
import IconsView from './views/IconsView.vue'
import AboutView from './views/AboutView.vue'
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
          component: HomeView
        },
        {
          path: 'icons/:collectionName?',
          name: 'icons',
          component: IconsView,
          props: true
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView
        }
      ]
    }
  ]
})

export default router
