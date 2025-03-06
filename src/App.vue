<template>
  <RouterView />

  <div class="contanier">
    <RouterLink to="/">inde</RouterLink>
    <div class="split-line"></div>
    <RouterLink to="/inline">inline</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { getConversationList } from '@/service/conversation.ts'

getConversationList()
  .then((list) => {
    console.log('conversation list: ', list)
  })
  .catch((error) => {
    console.error('Failed to get conversation list: ', error)
  })
</script>

<style lang="scss" scoped>
.contanier {
  position: absolute;
  top: 20px;
  right: 50px;
  display: flex;
  align-items: center;
  z-index: 200;

  a {
    color: #ccc;
  }

  .split-line {
    margin: 0 10px;
    display: inline-block;
    width: 1px;
    height: 20px;
    background-color: #ccc;
  }
}
</style>
