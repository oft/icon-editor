import { addCustomTab } from '@vue/devtools-api'
import { addCustomCommand } from '@vue/devtools-api'
import { onDevToolsClientConnected } from '@vue/devtools-api'


addCustomTab({
  // unique identifier
  name: 'vue-use',
  // title to display in the tab
  title: 'VueUse',
  // any icon from material design icons or a URL to an image
  icon: 'https://vueuse.org/favicon.svg',
  // iframe view
  view: {
    type: 'iframe',
    src: 'https://vueuse.org/',
  },
  category: 'advanced',
})

const SFC = /* vue */ `
  <script setup lang="ts">
  import { ref } from 'vue'

  const count = ref(0)
  </script>

  <template>
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div>
        count is {{ count }}
      </div>
      <button class="btn" @click="count++">
        increment
      </button>
    </div>
  </template>

  <style scoped>
  .btn {
    background-color: #4c51bf;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
  }
  </style>
`

addCustomTab({
  name: 'plugin-count',
  title: 'AppEditor',
  icon: 'baseline-add-chart',
  // SFC view
  view: {
    type: 'sfc',
    sfc: SFC,
  },
  category: 'app',
})



// Add a custom command with url
addCustomCommand({
  // unique identifier
  id: 'vueuse',
  // title to display in the command
  title: 'VueUse',
  // any icon from material design icons or a URL to an image
  icon: 'https://vueuse.org/favicon.svg',
  action: {
    type: 'url',
    src: 'https://vueuse.org/'
  }
})

// Add a custom command with submenu
addCustomCommand({
  // unique identifier
  id: 'vueuse',
  // title to display in the command
  title: 'VueUse',
  // any icon from material design icons or a URL to an image
  icon: 'https://vueuse.org/favicon.svg',
  // submenu, which is shown when the menu is clicked
  children: [
    {
      id: 'vueuse:github',
      title: 'Github',
      action: {
        type: 'url',
        src: 'https://github.com/vueuse/vueuse'
      }
    },
    {
      id: 'vueuse:website',
      title: 'Website',
      icon: 'auto-awesome',
      action: {
        type: 'url',
        src: 'https://vueuse.org/'
      }
    },
  ],
})

onDevToolsClientConnected(() => {
  console.log('devtools client connected')
})