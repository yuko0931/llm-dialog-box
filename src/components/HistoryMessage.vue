<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/index'
import { type ChatV3Message } from '@coze/api'

const store = useStore()
const { changeConversationId } = store
const {
  conversationList,
  showTip,
  firstSend,
  conversation_id,
  activeConversationId,
  curTitle,
  messages,
} = storeToRefs(store)
import { getMessageList } from '@/service/conversation'

const switch2ConversationId = async (coversation_id: string) => {
  changeConversationId(coversation_id) // 切换会话
  const result = await getMessageList(coversation_id) // 获取消息列表
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
  console.log('coversation messages:', sortedData)
  // 更新消息列表和标题
  curTitle.value = conversationList.value.find(
    (item) => item.coversation_id === coversation_id,
  )!.title
  messages.value = sortedData.map((item) => {
    return {
      role: item.role,
      content: item.content,
    }
  })
}
</script>

<template>
  <div class="history-message">
    <ul>
      <li
        :class="{ active: coversation_id === activeConversationId }"
        v-for="{ coversation_id, title } in conversationList"
        :key="coversation_id"
        @click="switch2ConversationId(coversation_id)"
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
