<template>
  <div class="w-full h-full mx-auto p-5 flex flex-col font-sans">
    <h1 class="text-center text-gray-800 mb-7.5 text-2xl font-semibold transition-colors duration-300 dark:text-white">
      图标预览与管理</h1>

    <!-- 图标使用示例 -->
    <section v-for="example in examples" :key="example.title"
      class="bg-white rounded-lg p-5 mb-5 shadow-sm transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-900/50">
      <h2 class="text-gray-600 mb-3.75 text-lg font-medium transition-colors duration-300 dark:text-white">
        {{ example.title }}</h2>
      <div class="flex flex-wrap gap-5 text-6xl items-center justify-center p-5 bg-gray-50 rounded-md transition-colors duration-300 dark:bg-gray-700">

        <template v-if="example.type === 'iconify'">
          <iconify-icon class="iconify" v-for="item in example.icons" :key="`iconify-${item}`" :icon="item"
            data-inline="false" />
        </template>
        <template v-else>
          <IconVue v-for="item in example.icons" :key="`iconvue-${item}`" :icon="item"></IconVue>
        </template>
      </div>
    </section>

    <div class="flex justify-center mt-7.5">
      <router-link to="/icons"
        class="inline-block px-6 py-3 bg-[#646cff] text-white no-underline rounded-lg text-base font-medium transition-all duration-200 cursor-pointer hover:bg-[#535bf2] hover:-translate-y-0.5 hover:shadow-md hover:shadow-[#646cff]/20">
        浏览图标集合
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconVue from '../components/IconVue'

// 图标示例数据
const icons = [
  'system-uicons:browser-alt',
  'carbon:calendar-settings',
  'mdi-light:hamburger',
  'la:arrow-circle-up-solid',
  'uim:vuejs',
  'noto:beaming-face-with-smiling-eyes',
  'fluent:text-column-two-24-filled',
  'my:circle',
]

const imports = [
  'ant-design:account-book-filled',
  'vscode-icons:file-type-pdf2',
  'vscode-icons:file-type-text',
  'vscode-icons:file-type-image',
  'vscode-icons:default-folder',
  'vscode-icons:default-folder-opened',
]

// 示例配置
const examples = [
  {
    title: '方式一：构建时自动导入',
    type: 'iconvue',
    icons
  },
  {
    title: '方式二：浏览时在线获取,使用 web-component',
    type: 'iconify',
    icons
  },
  {
    title: '方式三：引入图标集',
    type: 'iconvue',
    icons: imports
  }
]
</script>
