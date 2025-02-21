<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/index'
import { useRouter } from 'vue-router'

const store = useStore()
const { changeConversationId } = store
const { firstSendQuery, firstSendFiles, conversationList, conversation_id, activeConversationId } =
  storeToRefs(store)
const router = useRouter()

const hoveredCoversationId = ref<string>('') // 存储当前悬停的会话ID

const resetDate = (date: Date): Date => {
  const newDate = new Date(date) // 避免修改原日期对象
  newDate.setHours(0, 0, 0, 0)
  return newDate
}
// 优化后的分组逻辑（条件顺序调整）
const groupMap = [
  { check: (num: number) => num === 0, label: '今天' }, // 当天
  { check: (num: number) => num <= 1, label: '昨天' }, // 1天内
  { check: (num: number) => num <= 7, label: '7日内' }, // 7天内
  { check: (num: number) => num <= 30, label: '30日内' }, // 30天内
  { check: () => true, label: '更早' }, // 默认项
]

// 类型安全的分组函数
const conversationListGroups = computed(() => {
  const groups = conversationList.value.reduce(
    (acc, item) => {
      const dateDiff = Math.floor(
        (resetDate(new Date()).getTime() - resetDate(new Date(item.date)).getTime()) / 86400000,
      )

      const group = groupMap.find(({ check }) => check(dateDiff))!.label
      ;(acc[group] = acc[group] || []).push(item)
      return acc
    },
    {} as Record<string, typeof conversationList.value>,
  )

  return Object.entries(groups)
})
// 切换会话
const switch2ConversationId = (coversation_id: string) => {
  changeConversationId(coversation_id) // 切换会话
  conversation_id.value = coversation_id

  // 变量重置。路由跳转
  firstSendQuery.value = ''
  firstSendFiles.value = []
  router.push({
    name: 'chat',
    params: {
      conversationdId: coversation_id, // 参数名与路由定义一致
    },
  })
}
</script>

<template>
  <div class="history-message">
    <div v-for="[groupName, items] in conversationListGroups" :key="groupName">
      <div class="group-title">{{ groupName }}</div>
      <ul>
        <li
          class="conversation-item"
          :class="{ active: coversation_id === activeConversationId }"
          v-for="{ coversation_id, title } in items"
          :key="coversation_id"
          @click="switch2ConversationId(coversation_id)"
          @mouseenter="hoveredCoversationId = coversation_id"
          @mouseleave="hoveredCoversationId = ''"
        >
          <div class="conversation-title">{{ title }}</div>
          <div
            class="more-btn"
            v-show="
              coversation_id === activeConversationId || hoveredCoversationId === coversation_id
            "
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M3 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.history-message {
  .group-title {
    background-color: #171717;
    color: #555;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    position: sticky;
    top: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    > :last-child {
      margin-bottom: 6px;
    }

    .conversation-item {
      display: flex;
      align-items: center;

      .conversation-title {
        flex: 1;
        line-height: 24px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
      }

      .more-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        border-radius: 8px;

        &:hover {
          background-color: #44444d;
        }

        svg {
          height: 16px;
          width: 16px;
        }
      }
    }

    li {
      padding: 8px 10px;
      border-radius: 10px;
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
