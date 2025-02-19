<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { getMessageList } from '@/service/conversation'

const props = defineProps<{
  visible: boolean
  conversationId: string
  title: string
  onClose: () => void
  position?: { x: number; y: number }
}>()

const store = useStore()
const { renameConversation, deleteConversation, changeConversationId } = store
const { conversationList, detailMessageList, showTip, firstSend, conversation_id, curTitle, messages } = storeToRefs(store)

// 处理重命名
const handleRename = () => {
  const input = prompt('请输入新标题', props.title)
  if (!input) return
  if (/^\s+$/.test(input)) {
    alert('标题不能为空')
    return
  }
  const newTitle = input.trim()
  renameConversation(props.conversationId, newTitle)
  // 如果重命名的是当前激活的会话，同步更新当前标题
  if (props.conversationId === conversation_id.value) {
    curTitle.value = newTitle
  }
  props.onClose()
}

// 处理删除
const handleDelete = async () => {
  if (confirm('确认删除这个会话吗？')) {
    deleteConversation(props.conversationId)
    // 获取剩余会话列表中最新的一个会话
    const remainingConversations = conversationList.value
    if (remainingConversations.length > 0) {
      const latestConversation = remainingConversations[0]
      // 切换到最新的会话
      await switch2ConversationId(latestConversation.coversation_id)
    }
    props.onClose()
  }
}

const handleClose = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains('dialog-overlay')) {
    props.onClose()
  }
}
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
  // 更新消息列表和标题
  curTitle.value = conversationList.value.find(
    (item) => item.coversation_id === coversation_id,
  )!.title
  messages.value = result.data.map((item) => {
    return {
      role: item.role,
      content: item.content,
      content_type: item.content_type,
    }
  })
}
</script>

<template>
  <div v-if="visible" class="dialog-overlay" @click="handleClose">
    <div class="dialog-content" :style="{
      left: position?.x + 'px',
      top: position?.y + 'px'
    }">
      <div class="dialog-options">
        <div class="dialog-option" @click="handleRename">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span>重命名</span>
        </div>
        <div class="dialog-option delete" @click="handleDelete">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1000;
}

.dialog-content {
  position: fixed;
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
}

.dialog-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a2a2a;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &.delete {
    color: #ff4d4f;

    &:hover {
      background-color: rgba(255, 77, 79, 0.1);
    }
  }
}
</style>