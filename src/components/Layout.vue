<template>
  <div class="flex h-screen w-screen bg-gray-100 transition-colors duration-300 overflow-hidden dark:bg-gray-900">
    <!-- 左侧菜单 -->
    <aside class="w-60 bg-white shadow-lg transition-all duration-300 flex flex-col dark:bg-gray-800 dark:shadow-gray-900/50">
      <div class="p-5 border-b border-gray-200 bg-[#646cff] text-white">
        <h1 class="text-xl font-semibold m-0">Icon SVG</h1>
      </div>
      <nav class="flex-1 py-2.5 overflow-y-auto">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-5 py-3 text-gray-600 no-underline transition-all duration-200 border-l-3 border-transparent hover:bg-gray-100 hover:text-[#646cff] dark:text-gray-300 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-100 text-[#646cff] border-l-[#646cff] font-medium dark:bg-gray-700': $route.path === item.path || $route.path.startsWith(item.path + '/') }"
        >
          <span class="mr-3 text-lg">{{ item.icon }}</span>
          <span class="text-sm">{{ item.text }}</span>
        </router-link>
      </nav>
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          @click="() => toggleDark()" 
          class="w-full flex items-center justify-center gap-2 p-2 bg-gray-100 text-gray-600 rounded-md transition-all duration-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <span v-if="isDark">🌞</span>
          <span v-else>🌙</span>
          <span class="text-sm">{{ isDark ? '浅色模式' : '深色模式' }}</span>
        </button>
      </div>
    </aside>
    
    <!-- 右侧内容 -->
    <main class="flex-1 flex flex-col overflow-hidden w-[calc(100vw-240px)] dark:bg-gray-900">
      <header class="p-5 bg-white border-b border-gray-200 shadow-md flex-shrink-0 dark:bg-gray-800 dark:border-gray-700 dark:shadow-gray-900/50">
        <h2 class="m-0 text-gray-900 text-xl font-semibold dark:text-white">{{ pageTitle }}</h2>
      </header>
      <div class="flex-1 p-5 overflow-y-auto bg-gray-100 h-[calc(100vh-80px)] dark:bg-gray-900">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'

const route = useRoute()

// 深色模式管理
const isDark = useDark()
const toggleDark = useToggle(isDark)

const menuItems = [
  { path: '/', text: '主页', icon: '🏠' },
  { path: '/icons', text: '图标', icon: '🎨' },
  { path: '/about', text: '关于', icon: 'ℹ️' }
]

const pageTitle = computed(() => {
  const currentItem = menuItems.find(item => 
    route.path === item.path || route.path.startsWith(item.path + '/')
  )
  return currentItem ? currentItem.text : 'Icon SVG'
})
</script>
