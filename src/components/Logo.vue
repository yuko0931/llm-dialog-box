<template>
  <div class="logo" :class="{ collapsed: isCollapsed }">
    <span class="logo-text" v-if="!isCollapsed">ChatBox</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isCollapsed: boolean
}>()
</script>

<style lang="scss" scoped>
.logo {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  z-index: 100;
  position: relative;

  &.collapsed {
    padding: 12px 10px;
  }

  .logo-text {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-right: auto;
  }
}
</style>
