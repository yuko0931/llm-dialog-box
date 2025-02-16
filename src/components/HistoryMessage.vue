<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/index'
import { type ChatV3Message } from '@coze/api'

const store = useStore()
const { changeConversationId } = store
const {
  conversationList,
  detailMessageList,
  showTip,
  firstSend,
  conversation_id,
  activeConversationId,
  curTitle,
  messages,
} = storeToRefs(store)
import { getMessageList } from '@/service/conversation'

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
const switch2ConversationId = async (coversation_id: string) => {
  changeConversationId(coversation_id) // 切换会话
  const result = await getMessageList(coversation_id) // 获取消息列表
  detailMessageList.value = result.data
  console.log('coversation messages:', detailMessageList.value)
  if (showTip.value) {
    showTip.value = false
  }
  if (!firstSend.value) {
    firstSend.value = true
  }
  conversation_id.value = coversation_id
  // 按 chat_id 分组，组间按 created_at 排序，组内按 type 排序( answer在后 )
  const sortedData = Object.values(
    result.data.reduce<Record<string, ChatV3Message[]>>((acc, message) => {
      ;(acc[message.chat_id] ||= []).push(message)
      return acc
    }, {}),
  )
    .sort((a, b) => a[0].created_at - b[0].created_at) // 组间排序
    .flatMap((group) =>
      group.sort((b, a) => {
        // 组内排序
        if (a.type === 'answer') return -1
        else return 1
      }),
    )
  // console.log('coversation messages:', sortedData)
  // 更新消息列表和标题
  curTitle.value = conversationList.value.find(
    (item) => item.coversation_id === coversation_id,
  )!.title
  messages.value = sortedData.map((item) => {
    return {
      role: item.role,
      content: item.content,
      content_type: item.content_type,
    }
  })
}
</script>

<template>
  <div class="history-message">
    <div v-for="[groupName, items] in conversationListGroups" :key="groupName">
      <div class="group-title">{{ groupName }}</div>
      <ul>
        <li
          :class="{ active: coversation_id === activeConversationId }"
          v-for="{ coversation_id, title } in items"
          :key="coversation_id"
          @click="switch2ConversationId(coversation_id)"
        >
          <div>{{ title }}</div>
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
    margin: 6px 0;
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

    li {
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s;

      div {
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: clip;
      }

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
