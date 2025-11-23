<template>
    <span v-html="svg"></span>
</template>

<script setup lang="ts">
import appEditor from './my.json'
import { addCollection,renderHTML,renderIcon } from '@iconify/iconify'

const props = withDefaults(defineProps<{
    icon:string
}>(),{})

addCollection(appEditor)

const svg = computed(()=>renderHTML(props.icon))


</script>