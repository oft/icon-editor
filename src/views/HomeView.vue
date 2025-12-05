<template>
  <div class="w-full h-full mx-auto p-5 flex flex-col font-sans">
    <h1 class="text-center text-gray-800 mb-7.5 text-2xl font-semibold transition-colors duration-300 dark:text-white">
      图标预览与管理</h1>

    <section class="flex gap-2">
      <MyButton @click="handleLoadLocalJSON">加载JSON</MyButton>
      <MyButton @click="handleRenderIcons">渲染图标（非web-component）</MyButton>
      <MyButton @click="handleRenderIconsByWC">渲染图标（web-component）</MyButton>
    </section>
    <!-- 图标使用示例 -->
    <section
      class="bg-white rounded-lg p-5 mb-5 shadow-sm transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-900/50">
      <div v-if="renderWC">
        <iconify-icon class="iconify" v-for="item in icons" :key="`iconify-${item}`" :icon="item" inline="false" />
      </div>
      <div class="flex" v-if="render">
        <IconVue v-for="item in icons" :key="`iconvue-${item}`" :icon="item"></IconVue>
      </div>
    </section>
    <section>
      <h2>观察网络请求</h2>

      <h3>
        <ol>
          <li>web-compoonent 始终会使用 iconify 服务</li>
          <li>非 web-component 会优先使用 加载的 json 中图标</li>
        </ol>

      </h3>
    </section>

    <div class="flex justify-center mt-7.5">
      <router-link to="/icons">
        <MyButton>浏览图标集合</MyButton>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconVue, { useLocalJson } from '../components/IconVue'
import MyButton from '@/components/MyButton.vue'

const renderWC = ref(false)
const render = ref(false)
const handleRenderIcons = () => {
  render.value = true;
}
const handleRenderIconsByWC = () => {
  renderWC.value = true;
}

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
  'ant-design:account-book-filled',
  'vscode-icons:file-type-pdf2',
  'vscode-icons:file-type-text',
  'vscode-icons:file-type-image',
  'vscode-icons:default-folder',
  'vscode-icons:default-folder-opened',
]

const handleLoadLocalJSON = () => useLocalJson()

</script>
