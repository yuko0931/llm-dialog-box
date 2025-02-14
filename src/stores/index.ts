import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { conversationInfo } from '@/types/index'

export const useStore = defineStore('coversation', () => {
  const isRegenerate = ref<boolean>(false) // 是否重新生成llm answer
  const curTitle = ref<string>('') // 当前会话标题
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
    }
  }

  // 删除会话
  const deleteConversation = (id: string) => {
    // 删除会话
    const index = conversationList.value.findIndex((item) => item.coversation_id === id)
    if (index !== -1) {
      conversationList.value.splice(index, 1)
    }
  }
  return {
    isRegenerate,
    curTitle,
    conversationList,
    activeConversationId,
    changeConversationId,
    renameConversation,
    deleteConversation,
  }
})
