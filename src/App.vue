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
</script>

<style lang="scss" scoped>
.contanier {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;

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
