<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto dark:bg-gray-800">
      <div class="p-5 border-b border-gray-200 flex justify-between items-center dark:border-gray-700">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">图标预览</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="关闭"
        >
          ✕
        </button>
      </div>
      
      <div class="p-5">
        <div v-if="iconData" class="space-y-6">
          <!-- 图标预览 -->
          <div class="flex items-center justify-center p-8 bg-gray-50 rounded-md dark:bg-gray-700">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              aria-hidden="true" 
              role="img" 
              width="128" 
              height="128"
              :viewBox="`0 0 ${iconData.data.width || defaultWidth} ${iconData.data.height || defaultHeight}`"
              v-html="iconData.data.body"
              :style="{
                fill: 'currentColor',
                stroke: 'currentColor'
              }"
              class="text-gray-800 dark:text-white"
            ></svg>
          </div>
          
          <!-- 图标信息 -->
          <div class="space-y-4">
            <div>
              <h4 class="text-lg font-medium text-gray-800 mb-2 dark:text-white">图标信息</h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-3 rounded-md dark:bg-gray-700">
                  <span class="text-sm text-gray-500 dark:text-gray-400 block mb-1">图标名称</span>
                  <span class="text-base font-medium text-gray-800 dark:text-white">{{ iconData.key }}</span>
                </div>
                <div class="bg-gray-50 p-3 rounded-md dark:bg-gray-700">
                  <span class="text-sm text-gray-500 dark:text-gray-400 block mb-1">图标集合</span>
                  <span class="text-base font-medium text-gray-800 dark:text-white">{{ iconSetPrefix }}</span>
                </div>
              </div>
            </div>
            
            <!-- SVG 代码 -->
            <div>
              <h4 class="text-lg font-medium text-gray-800 mb-2 dark:text-white">SVG 代码</h4>
              <pre class="bg-gray-50 p-3 rounded-md overflow-x-auto text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {{ generateSvgCode() }}
              </pre>
            </div>
            
            <!-- 使用示例 -->
            <div>
              <h4 class="text-lg font-medium text-gray-800 mb-2 dark:text-white">使用示例</h4>
              
              <div class="space-y-3">
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400 block mb-1">1. 在 HTML 中使用</span>
                  <pre class="bg-gray-50 p-3 rounded-md overflow-x-auto text-sm text-gray-800 dark:bg-gray-700 dark:text-gray-300">
&lt;svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 {{ defaultWidth }} {{ defaultHeight }}"&gt;
  {{ iconData.data.body }}
&lt;/svg&gt;
                  </pre>
                </div>
                
                <div>
                  <span class="text-sm text-gray-500 dark:text-gray-400 block mb-1">2. 在按钮中使用</span>
                  <div class="flex items-center gap-2">
                    <button class="px-4 py-2 bg-[#646cff] text-white rounded-md flex items-center gap-2 hover:bg-[#535bf2] transition-colors">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16"
                        :viewBox="`0 0 ${iconData.data.width || defaultWidth} ${iconData.data.height || defaultHeight}`"
                        v-html="iconData.data.body"
                        :style="{
                          fill: 'currentColor',
                          stroke: 'currentColor'
                        }"
                      ></svg>
                      <span>按钮文本</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
  visible: boolean;
  iconData: { key: string; data: { body: string; width?: number; height?: number } } | null;
  defaultWidth: number;
  defaultHeight: number;
  iconSetPrefix: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// 生成 SVG 代码
const generateSvgCode = () => {
  if (!props.iconData) return '';
  
  const { data } = props.iconData;
  const width = data.width || props.defaultWidth;
  const height = data.height || props.defaultHeight;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" stroke="currentColor">
  ${data.body}
</svg>`;
};
</script>