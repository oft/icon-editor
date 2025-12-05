<template>
  <div 
    class="flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded-md cursor-pointer transition-all duration-200 aspect-square hover:border-[#646cff] hover:shadow-md hover:shadow-[#646cff]/15 hover:-translate-y-0.5 dark:bg-gray-700 dark:border-gray-600 relative group"
    :ref="el => observeIcon(el)"
    :data-icon-key="item.key"
  >
    <!-- 预览按钮 -->
    <button 
      @click.stop="$emit('preview', item)"
      class="absolute top-1 right-1 bg-[#646cff] text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs hover:bg-[#535bf2] z-10"
      title="预览图标"
    >
      👁️
    </button>
    
    <div class="flex-1 flex items-center justify-center w-full h-full">
      <iconify-icon :icon="item.key"></iconify-icon>
      <!-- <svg 
        v-if="visible"
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true" 
        role="img"
        :viewBox="`0 0 ${item.data.width || defaultWidth} ${item.data.height || defaultHeight}`"
        preserveAspectRatio="xMidYMid meet"
        v-html="item.data.body"
        :style="{
          fill: 'currentColor',
          stroke: 'currentColor',
          width: '100%',
          height: '100%',
          maxWidth: '80px',
          maxHeight: '80px'
        }"
        class="transition-all duration-200 hover:scale-110 text-gray-600 dark:text-gray-300 flex-shrink-0"
      ></svg> -->
    </div>
    <span class="text-xs text-gray-600 text-center overflow-hidden text-ellipsis whitespace-nowrap max-w-full px-1 dark:text-gray-400 mt-1">{{ item.key }}</span>
  </div>
</template>

<script setup lang="ts">
// Props
const { item, defaultWidth, defaultHeight, visible } = defineProps<{
  item: {
    key: string;
    data: { body: string; width?: number; height?: number };
  };
  defaultWidth: number;
  defaultHeight: number;
  visible: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'preview', item: { key: string; data: { body: string; width?: number; height?: number } }): void;
  (e: 'observe', el: any): void;
}>();

// 图标可见性检测
const observeIcon = (el: any) => {
  emit('observe', el);
};
</script>