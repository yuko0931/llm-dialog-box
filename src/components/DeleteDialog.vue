<script setup lang="ts">
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { getMessageList } from '@/service/conversation'

const props = defineProps<{
  visible: boolean
  conversationId: string
  onClose: () => void
}>()

const store = useStore()
const { deleteConversation, changeConversationId } = store
const { conversationList, detailMessageList, showTip, firstSend, conversation_id, curTitle, messages } = storeToRefs(store)

// 处理删除
const handleDelete = async () => {
  deleteConversation(props.conversationId)
  // 获取剩余会话列表中最新的一个会话
  const remainingConversations = conversationList.value
  if (remainingConversations.length > 0) {
    const latestConversation = remainingConversations[0]
    // 切换到最新的会话
    await switch2ConversationId(latestConversation.coversation_id)
  }
  // 关闭DeleteDialog
  props.onClose()
  // 模拟点击主屏幕区域来关闭MoreDialog
  document.querySelector('.dialog-overlay')?.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
  )
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
  <div v-if="visible" class="dialog-overlay" @click="onClose">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">删除会话</div>
      <div class="dialog-body">确认删除这个会话吗？此操作无法撤销。</div>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="onClose">取消</button>
        <button class="delete-btn" @click="handleDelete">删除</button>
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fff;
}

.dialog-body {
  margin-bottom: 20px;
  color: #888;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: background-color 0.2s;

    &.cancel-btn {
      background-color: transparent;
      color: #888;
      border: 1px solid #333;

      &:hover {
        background-color: #2a2a2a;
      }
    }

    &.delete-btn {
      background-color: #dc2626;
      color: white;

      &:hover {
        background-color: #b91c1c;
      }
    }
  }
}
</style>
