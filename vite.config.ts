import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

///@ts-ignore
import PurgeIcons from 'vite-plugin-purge-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // Exclude custom elements from Vue component resolution
          // Syntax: (tag: string) => boolean
          isCustomElement: (tag) => {
            // Example 1: Match specific custom elements (e.g., <iconify-icon>, <my-svg>)
            return tag === 'iconify-icon';
            
            // Example 2: Match all custom elements (tags with hyphens, per web component spec)
            // return tag.includes('-'); 
          }
        }
      }
    }),
    PurgeIcons(),
    UnoCSS(),
  ],
})
