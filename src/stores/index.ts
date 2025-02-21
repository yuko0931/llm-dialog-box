import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { conversationInfo, chatMessage } from '@/types/index'
import { type ChatV3Message } from '@coze/api'

export const useStore = defineStore('coversation', () => {
  const isRegenerate = ref<boolean>(false) // 是否重新生成llm answer
  const showTip = ref<boolean>(true) // 控制 tip 的显示
  const firstSend = ref<boolean>(false) // 是否是第一次发送消息
  const conversation_id = ref<string>('') // 会话id
  const curTitle = ref<string>('') // 当前会话标题
  const messages = ref<chatMessage[]>([]) // 消息列表
  const detailMessageList = ref<ChatV3Message[]>([]) // 从扣子api更新得到的详细消息列表
  const conversationList = ref<conversationInfo[]>( // 会话列表(用于侧边历史会话
    localStorage.getItem('conversationList')
      ? JSON.parse(localStorage.getItem('conversationList') as string)
      : [],
  )
  const activeConversationId = ref<string>('') // 选中的会话id
  // 切换会话
  const changeConversationId = (id: string) => {
    activeConversationId.value = id
  }
  // 重命名会话
  const renameConversation = (id: string, title: string) => {
    const index = conversationList.value.findIndex((item) => item.coversation_id === id)
    if (index !== -1) {
      conversationList.value[index].title = title
      // 保存到本地存储
      localStorage.setItem('conversationList', JSON.stringify(conversationList.value))
    }
  }

  // 删除会话
  const deleteConversation = (id: string) => {
    // 删除会话
    const index = conversationList.value.findIndex((item) => item.coversation_id === id)
    if (index !== -1) {
      conversationList.value.splice(index, 1)
      // 保存到本地存储
      localStorage.setItem('conversationList', JSON.stringify(conversationList.value))
    }
  }
  return {
    isRegenerate,
    showTip,
    firstSend,
    conversation_id,
    curTitle,
    messages,
    detailMessageList,
    conversationList,
    activeConversationId,
    changeConversationId,
    renameConversation,
    deleteConversation,
  }
})
