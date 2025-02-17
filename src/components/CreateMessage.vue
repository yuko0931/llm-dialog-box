<script setup lang="ts">
import { messageStore } from '@/stores/messageStore'
import styles from '@/assets/styles/CreateMessage.module.scss'
import { watch } from 'vue'
import { storeToRefs } from 'pinia' // 新增导入

const store = messageStore()
const { addMessage } = store
const { activeMessageId } = storeToRefs(store) // 正确解构响应式属性

watch(activeMessageId, (newId) => {
  console.log('[Debug] 活跃会话ID变化:', newId);
});
</script>

<template>
   <div class="create-message">
    <div @click="addMessage">开启新对话</div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/CreateMessage.module.scss";
</style>

<style scoped lang="scss">
@use "@/assets/styles/CreateMessage.module.scss";
</style>