<template>
    <span v-html="svg"></span>
</template>

<script setup lang="ts">
import appEditor from './my.json'
import { addCollection,getIcon } from 'iconify-icon'
import { iconToHTML,iconToSVG } from '@iconify/utils'

const props = withDefaults(defineProps<{
    icon:string
}>(),{})

addCollection(appEditor)

const svg = computed(()=>{
    const icons = getIcon(props.icon)!
    const result = iconToSVG(icons)
    return iconToHTML(result.body,result.attributes)
})


</script>