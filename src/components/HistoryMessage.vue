<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores/index'
import { type ChatV3Message } from '@coze/api'
import MoreDialog from './MoreDialog.vue'

const store = useStore()
const { changeConversationId, renameConversation } = store
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
const editingId = ref<string>('') // 当前正在编辑的会话ID
const editingTitle = ref<string>('') // 编辑中的标题

const resetDate = (date: Date): Date => {
  const newDate = new Date(date) // 避免修改原日期对象
  newDate.setHours(0, 0, 0, 0)
  return newDate
}

// 开始编辑标题
const startEditing = (coversation_id: string, title: string, event?: MouseEvent) => {
  event?.stopPropagation()
  editingId.value = coversation_id
  editingTitle.value = title
  nextTick(() => {
    const titleInput = document.querySelector(`[data-conversation-id="${coversation_id}"] .title-input`) as HTMLInputElement
    if (titleInput) {
      titleInput.focus()
    }
  })
}

// 保存编辑的标题
const saveTitle = (coversation_id: string, event: MouseEvent) => {
  event.stopPropagation()
  if (editingTitle.value.trim()) {
    const conversation = conversationList.value.find(item => item.coversation_id === coversation_id)
    if (conversation) {
      conversation.title = editingTitle.value.trim()
      renameConversation(coversation_id, editingTitle.value.trim())
      if (coversation_id === conversation_id.value) {
        curTitle.value = editingTitle.value.trim()
      }
    }
  }
  editingId.value = ''
}

// 处理按键事件
const handleKeyDown = (event: KeyboardEvent, coversation_id: string) => {
  if (event.key === 'Enter') {
    saveTitle(coversation_id, event as unknown as MouseEvent)
  } else if (event.key === 'Escape') {
    editingId.value = ''
  }
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
  if (editingId.value) return // 如果正在编辑标题，不允许切换会话
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
          :class="{ active: coversation_id === activeConversationId, editing: editingId === coversation_id }"
          v-for="{ coversation_id, title } in items"
          :key="coversation_id"
          :data-conversation-id="coversation_id"
          @click="switch2ConversationId(coversation_id)"
          @mouseenter="hoveredCoversationId = coversation_id"
          @mouseleave="hoveredCoversationId = ''"
        >
          <div class="conversation-title" @dblclick="startEditing(coversation_id, title, $event)">
            <input
              v-if="editingId === coversation_id"
              v-model="editingTitle"
              @click.stop
              @blur="saveTitle(coversation_id, $event)"
              @keydown="handleKeyDown($event, coversation_id)"
              class="title-input"
              ref="titleInput"
            >
            <span v-else>{{ title }}</span>
          </div>
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
                d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <MoreDialog
    v-if="showMoreDialog && selectedConversation"
    :visible="showMoreDialog"
    :conversation-id="selectedConversation.id"
    :title="selectedConversation.title"
    :position="selectedConversation.position"
    :on-close="closeMoreDialog"
  />
</template>

<style scoped lang="scss">
.history-message {
  height: 100%;
  overflow-y: auto;
  margin: 0 0 0 -50px;  // 减小负的左外边距，使内容向左移动的幅度更合适
  padding: 0 10px;
}
.group-title {
  font-size: 12px;
  color: #888;
  margin: 12px 0 8px 0;  // 增加上下间距，使分组标题更加明显
  padding-left: 45px;  // 添加左内边距，使分组标题与会话项对齐
}
.conversation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 8px;
  margin: 1px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a2a2a;
  }

  &.active {
    background-color: #2a2a2a;
  }

  &.editing {
    background-color: #3a3a3a;
    border: 1px solid #4a4a4a;
  }
  .conversation-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 8px;
  }

  .title-input {
    width: 100%;
    background-color: #333;
    border: 2px solid #666;
    border-radius: 6px;
    padding: 6px 10px;
    color: #fff;
    outline: none;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      border-color: #888;
      background-color: #383838;
    }

    &:focus {
      border-color: #1668dc;
      background-color: #383838;
      border-width: 2px;
      box-shadow: 0 0 0 3px rgba(22, 104, 220, 0.3);
    }
  }
  .more-btn {
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #3a3a3a;
    }

    svg {
      width: 16px;
      height: 16px;
      color: #888;
    }
  }
}
</style>

