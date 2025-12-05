<template>
  <div class="w-full h-full flex justify-center items-start overflow-y-auto">
    <div class="max-w-2xl w-full bg-white rounded-lg shadow-sm p-6 transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-900/50">
      <h3 class="text-gray-800 mb-4 text-xl font-semibold dark:text-white">关于 Icon SVG</h3>
      <p class="text-gray-600 leading-relaxed mb-4 dark:text-gray-300">这是一个基于 Vite + Vue 3 + TypeScript 开发的图标预览和管理工具，用于展示和管理 Iconify 图标集合。</p>
      
      <h4 class="text-gray-700 mt-6 mb-3 text-lg font-medium dark:text-white">功能特性</h4>
      <ul class="list-none p-0 m-0 mb-6">
        <li v-for="feature in features" :key="feature" class="text-gray-600 py-2 flex items-center dark:text-gray-300">
          {{ feature }}
        </li>
      </ul>
      
      <h4 class="text-gray-700 mt-6 mb-3 text-lg font-medium dark:text-white">技术栈</h4>
      <div class="flex flex-wrap gap-3 mb-6">
        <div v-for="tech in techStack" :key="tech" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium transition-all duration-200 hover:bg-[#646cff] hover:text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#646cff]/20 dark:bg-gray-700 dark:text-gray-300">
          {{ tech }}
        </div>
      </div>
      
      <h4 class="text-gray-700 mt-6 mb-3 text-lg font-medium dark:text-white">使用说明</h4>
      <ol class="text-gray-600 pl-5 m-0 mb-6 dark:text-gray-300">
        <li v-for="(step, index) in usageSteps" :key="index" class="mb-3 leading-relaxed">
          {{ step }}
        </li>
      </ol>
      
      <div class="mt-8 pt-4 border-t border-gray-200 text-gray-400 text-sm text-center dark:border-gray-700 dark:text-gray-500">
        <p>© 2025 Icon SVG. 基于 MIT 许可证开源。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 功能特性列表
const features = [
  '🖼️ 多种图标使用方式示例',
  '📚 浏览所有 Iconify 图标集合',
  '🔍 搜索和过滤图标',
  '🌓 支持浅色/深色模式',
  '📱 响应式设计',
  '⚡ 性能优化，延迟加载图标'
]

// 技术栈列表
const techStack = [
  'Vue 3',
  'TypeScript',
  'Vite',
  'Vue Router',
  'Iconify',
  'Axios'
]

// 使用说明步骤
const usageSteps = [
  '从左侧菜单选择"主页"查看图标使用示例',
  '选择"图标"浏览和搜索图标集合',
  '在图标页面中，从左侧选择一个图标集合',
  '在右侧可以搜索和查看该集合中的所有图标',
  '图标会根据可视区域自动加载，提高性能'
]
</script>
