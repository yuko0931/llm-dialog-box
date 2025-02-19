<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/index'
import { type ChatV3Message } from '@coze/api'
import MoreDialog from './MoreDialog.vue'

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

const hoveredCoversationId = ref<string>('') // 存储当前悬停的会话ID
const showMoreDialog = ref(false) // 控制更多选项对话框的显示
const selectedConversation = ref<{ id: string; title: string; position?: { x: number; y: number } } | null>(null) // 当前选中的会话

const resetDate = (date: Date): Date => {
  const newDate = new Date(date) // 避免修改原日期对象
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

// 打开更多选项对话框
const openMoreDialog = (coversation_id: string, title: string, event: MouseEvent) => {
  event.stopPropagation() // 阻止事件冒泡，避免触发会话切换
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  selectedConversation.value = { 
    id: coversation_id, 
    title,
    position: {
      x: rect.right + 5, // 在按钮右侧显示，留出5px间距
      y: rect.top
    }
  }
  showMoreDialog.value = true
}

// 关闭更多选项对话框
const closeMoreDialog = () => {
  showMoreDialog.value = false
  selectedConversation.value = null
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
            @click="openMoreDialog(coversation_id, title, $event)"
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

    <!-- 更多选项对话框 -->
    <MoreDialog
      v-if="selectedConversation"
      :visible="showMoreDialog"
      :conversation-id="selectedConversation.id"
      :title="selectedConversation.title"
      :position="selectedConversation.position"
      :on-close="closeMoreDialog"
    />
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