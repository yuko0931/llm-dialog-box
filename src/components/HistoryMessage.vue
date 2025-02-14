<script setup lang="ts">
import { storeToRefs } from "pinia";
import { messageStore } from "@/stores/messageStore";
import { watch } from "vue"; // 引入 watch

const store = messageStore();
const { changeMessageId } = messageStore();
const { data, activeMessageId } = storeToRefs(store);

// 监听 data 的变化
watch(data, (newData) => {
  console.log('[Debug] 会话列表更新:', newData);
});
</script>

<template>
  <div class="history-message">
    <ul>
      <li
        :class="{ active: id === activeMessageId }"
        v-for="{ id, name } in data"
        :key="id"
        @click="changeMessageId(id)"
      >
        {{ name }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.history-message {
  .new-message-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(77, 107, 254, 0.1);
    color: #4D6BFE;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 10px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(77, 107, 254, 0.2);
    }

    span {
      margin-left: 8px;
      font-size: 14px;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: rgba(77, 107, 254, 0.1);
      }

      &.active {
        background-color: #4d6bfe;
        color: white;
      }
    }
  }
}
</style>