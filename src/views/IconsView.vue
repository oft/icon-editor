<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex gap-5 h-full flex-1">
      <!-- 左侧图标集合列表 -->
      <aside class="w-70 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-900/50 h-full flex flex-col">
        <div class="h-full flex flex-col">
          <h3 class="p-4 m-0 text-lg font-semibold text-gray-800 border-b border-gray-200 bg-gray-50 dark:text-white dark:bg-gray-700 dark:border-gray-700">图标集合</h3>
          <div class="p-3 border-b border-gray-200 dark:border-gray-700">
            <input 
              type="text" 
              v-model="collectionSearch"
              placeholder="搜索图标集合..."
              class="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/20 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
            />
          </div>
          <div class="flex-1 overflow-y-auto p-2">
            <div 
              v-for="name in filteredCollections" 
              :key="name"
              class="p-2 rounded-md cursor-pointer text-sm text-gray-600 transition-all duration-200 mb-1 hover:bg-gray-100 hover:text-[#646cff] dark:text-gray-300 dark:hover:bg-gray-700"
              :class="{ 'bg-[#646cff] text-white font-medium': selectedCollection === name }"
              @click="selectCollection(name)"
            >
              {{ name }}
            </div>
          </div>
        </div>
      </aside>
      
      <!-- 右侧图标展示 -->
      <section class="flex-1 bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-900/50 flex flex-col h-full">
        <div v-if="!selectedCollection" class="flex-1 flex flex-col items-center justify-center p-10 text-gray-400 text-center dark:text-gray-500">
          <h3 class="mb-2.5 text-gray-600 dark:text-gray-400">请选择一个图标集合</h3>
          <p>从左侧列表中选择一个图标集合来查看其中的图标</p>
        </div>
        
        <div v-else class="flex flex-col h-full">
          <div class="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-700">
            <h3 class="m-0 text-lg font-semibold text-gray-800 dark:text-white">{{ selectedCollection }} <span class="inline-block bg-[#646cff] text-white text-xs px-2 py-0.5 rounded-full ml-2 font-normal"> {{ selecticons.length }}</span></h3>
            <div class="w-64">
              <input 
                type="text" 
                v-model="iconSearch"
                placeholder="搜索图标..."
                class="w-full p-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 transition-all duration-200 focus:outline-none focus:border-[#646cff] focus:ring-2 focus:ring-[#646cff]/20 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
              />
            </div>
          </div>
          
          <!-- 使用 IconPreview 组件 -->
          <IconPreview 
            :icon-data="iconfJsonObj" 
            :search-query="iconSearch" 
            :selected-icon="selectedIcon"
            :is-loading="isLoading"
            :percent="percent"
            :error="error"
            @icon-select="handleIconSelect"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import collections from '@iconify/json/collections.json'
import axios from 'axios';
import IconPreview from '../components/IconPreview.vue';

const router = useRouter();

// 接收路由参数
const props = defineProps<{
  collectionName?: string
}>();

// 状态管理
const selectedCollection = ref('')
const collectionSearch = ref('')
const iconSearch = ref('')
const percent = ref(0);
const isLoading = ref(false);
const error = ref('');
const selectedIcon = ref('');

const collectionNames = Object.keys(collections)

const filteredCollections = computed(() => {
  if (!collectionSearch.value) return collectionNames
  const query = collectionSearch.value.toLowerCase()
  return collectionNames.filter(name => 
    name.toLowerCase().includes(query)
  )
})

const iconfJsonObj = ref<{
  "prefix": string,
  "icons": Record<string, { body: string, width?: number, height?: number }>,
  "aliases": Record<string, { parent: string }>,
  "lastModified": number,
  "width": number,
  "height": number
}>()

const selecticons = computed(() => {
  if (!iconfJsonObj.value) return []
  return Object.keys(iconfJsonObj.value.icons).map(k => ({
    key: k,
    data: iconfJsonObj.value!.icons[k]!
  }))
})

const selectCollection = async (name: string) => {
  selectedCollection.value = name
  // 更新路由
  await router.push({
    name: 'icons',
    params: { collectionName: name }
  })
  await loadIconsJson(name)
}

const loadIconsJson = async (name: string, version = 'latest') => {
  percent.value = 0;
  isLoading.value = true;
  error.value = '';
  selectedIcon.value = '';
  
  try {
    const response = await axios.get(`https://registry.npmmirror.com/@iconify-json/${name}/${version}/files/icons.json`, {
      responseType: 'json',
      onDownloadProgress: (progressEvent: any) => {
        if (progressEvent.total) {
          percent.value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        }
      }
    });
    iconfJsonObj.value = response.data;
  } catch (err: any) {
    console.error('下载失败:', err);
    error.value = err.message || '加载图标集合失败';
  } finally {
    percent.value = 0;
    isLoading.value = false;
  }
}

// 监听路由参数变化
watch(() => props.collectionName, async (newName) => {
  if (newName && newName !== selectedCollection.value) {
    selectedCollection.value = newName;
    await loadIconsJson(newName);
  }
}, { immediate: true })

// 组件挂载时检查初始路由参数
onMounted(async () => {
  if (props.collectionName) {
    selectedCollection.value = props.collectionName;
    await loadIconsJson(props.collectionName);
  }
})

// 图标选中事件处理
const handleIconSelect = (iconKey: string) => {
  selectedIcon.value = iconKey;
  console.log('选中的图标:', iconKey);
  // 这里可以添加更多的处理逻辑，比如复制图标信息到剪贴板等
};
</script>
