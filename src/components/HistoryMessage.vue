<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/index'

const store = useStore()
const { changeConversationId } = store
const { conversationList, activeConversationId } = storeToRefs(store)
</script>

<template>
  <div class="history-message">
    <ul>
      <li
        :class="{ active: coversation_id === activeConversationId }"
        v-for="{ coversation_id, title } in conversationList"
        :key="coversation_id"
        @click="changeConversationId(coversation_id)"
      >
        {{ title }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.history-message {
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
