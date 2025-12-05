<template>
  <div class="icon-preview relative">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-[#646cff] rounded-full animate-spin"></div>
      <div class="text-gray-600 text-base dark:text-gray-400">加载中... {{ percent }}%</div>
      <div class="w-full max-w-sm h-2 bg-gray-200 rounded-md overflow-hidden dark:bg-gray-700">
        <div class="h-full bg-[#646cff] transition-all duration-300" :style="{ width: percent + '%' }"></div>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="p-4 m-4 bg-red-50 text-red-600 rounded-md border border-red-200 text-center dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
      {{ error }}
    </div>
    
    <!-- 图标列表 -->
    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 p-3 overflow-auto flex-1 h-0">
      <IconItem 
        v-for="item in filteredIcons" 
        :key="item.key"
        :item="item"
        :default-width="iconData?.width || 24"
        :default-height="iconData?.height || 24"
        :visible="visibleIcons.has(item.key)"
        @preview="showPreview"
        @observe="observeIcon"
      />
      <div v-if="filteredIcons.length === 0" class="col-span-full flex-1 flex flex-col items-center justify-center p-10 text-gray-400 text-center dark:text-gray-500">
        未找到匹配的图标
      </div>
    </div>
    
    <!-- 预览模态框 -->
    <IconPreviewModal 
      :visible="previewVisible"
      :icon-data="selectedIconData"
      :default-width="iconData?.width || 24"
      :default-height="iconData?.height || 24"
      :icon-set-prefix="iconData?.prefix || ''"
      @close="closePreview"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import IconItem from './IconItem.vue';
import IconPreviewModal from './IconPreviewModal.vue';

// Props
const props = defineProps<{
  iconData: {
    prefix: string;
    icons: Record<string, { body: string; width?: number; height?: number }>;
    aliases: Record<string, { parent: string }>;
    lastModified: number;
    width: number;
    height: number;
  } | null | undefined;
  searchQuery: string;
  selectedIcon: string;
  isLoading: boolean;
  percent: number;
  error: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'icon-select', iconKey: string): void;
}>();

// 图标可见性检测
const visibleIcons = ref<Set<string>>(new Set());
const iconObserver = ref<IntersectionObserver | null>(null);

// 预览相关状态
const previewVisible = ref(false);
const selectedIconData = ref<{ key: string; data: { body: string; width?: number; height?: number } } | null>(null);

// 监听 iconData 变化，重置可见图标
watch(() => props.iconData, () => {
  visibleIcons.value.clear();
  setupIntersectionObserver();
});

// 过滤后的图标列表
const filteredIcons = computed(() => {
  if (!props.iconData) return [];
  
  const icons = Object.keys(props.iconData.icons).map(k => ({
    key: k,
    data: props.iconData!.icons[k]!
  }));
  
  if (!props.searchQuery) return icons;
  
  const query = props.searchQuery.toLowerCase();
  return icons.filter(icon => 
    icon.key.toLowerCase().includes(query)
  );
});

// 图标可见性检测
const setupIntersectionObserver = () => {
  if (iconObserver.value) {
    iconObserver.value.disconnect();
  }
  
  iconObserver.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const iconKey = entry.target.getAttribute('data-icon-key');
      if (iconKey) {
        if (entry.isIntersecting) {
          visibleIcons.value.add(iconKey);
          iconObserver.value?.unobserve(entry.target);
        }
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.1
  });
};

const observeIcon = (el: any) => {
  if (el && typeof el === 'object' && 'nodeType' in el && el.nodeType === 1 && iconObserver.value) {
    iconObserver.value.observe(el);
  }
};

// 预览相关方法
const showPreview = (item: { key: string; data: { body: string; width?: number; height?: number } }) => {
  selectedIconData.value = item;
  previewVisible.value = true;
  emit('icon-select', item.key);
};

const closePreview = () => {
  previewVisible.value = false;
  selectedIconData.value = null;
};

onMounted(() => {
  setupIntersectionObserver();
});

onUnmounted(() => {
  if (iconObserver.value) {
    iconObserver.value.disconnect();
  }
});
</script>

<style scoped>
.icon-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 15px;
}
</style>