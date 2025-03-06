<template>
  <div class="container">
    <SiderBar />

    <!-- 使用 Sidebar 组件 -->
    <div class="main-wrapper">
      <div class="chat-wrapper">
        <RouterView> </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SiderBar from '@/components/SiderBar.vue'
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;

  .main-wrapper {
    flex: 1 1 0%;
    background-color: #212121;
    color: #fff;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    padding: 0 64px;

    @media (max-width: 768px) {
      padding: 0 16px;
    }

    .chat-wrapper {
      height: calc(100% - 60px);
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-grow: 1;
    }
  }
}
</style>
