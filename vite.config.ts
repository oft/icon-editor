import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import watchDirCommand from './plugins/vite-icon-build'
import buildIcon from './scripts/build'

const resolvePath = (dir: string) => resolve(import.meta.dirname, dir)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    watchDirCommand({
      watch:resolvePath('./scripts/svgs'),
      // command:'pnpm run build:icon',
      callback:()=>buildIcon(),
    }),
    unocss(),
    vue(),
    Components({
      dts: resolvePath('./types/components.d.ts'),
    }),
    AutoImport({
      dts: resolvePath('./types/auto-imports.d.ts'),
      imports: [
        'vue'
      ],
    })
  ],

})
