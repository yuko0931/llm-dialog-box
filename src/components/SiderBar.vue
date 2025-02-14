<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { messageStore } from '@/stores/messageStore'
import { MenuFold, MenuUnfold } from '@icon-park/vue-next'
import CreateMessage from './CreateMessage.vue'
import HistoryMessage from './HistoryMessage.vue'

const store = messageStore()

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

</script>

<template>
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
    <!-- 折叠按钮保持原有位置 -->
    <div class="sidebar-toggle" @click="toggleSidebar">
      <MenuFold v-if="!isCollapsed" theme="outline" :size="24" />
      <MenuUnfold v-else theme="outline" :size="24" />
    </div>
    <CreateMessage v-if="!isCollapsed" />

    <!-- 整合后的内容区域 -->
    <div v-if="!isCollapsed" class="sidebar-content">  

      <!-- 历史对话列表 -->
      <div class="sidebar-section">
        <h3>历史对话</h3>
        <HistoryMessage v-if="!isCollapsed" />
      </div>
    
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100%;
  background-color: #171717;
  color: #fff;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-toggle {
  cursor: pointer;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-content {
  padding: 20px;
}

.sidebar-header, .sidebar-section {
  margin-bottom: 20px;
}

.new-conversation-btn {
  width: 100%;
  padding: 10px;
  background-color: #4d6bfe;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>