// 聊天消息类型
export interface chatMessage {
  role: 'user' | 'assistant'
  content: string
}

// 会话信息类型
export interface conversationInfo {
  title: string
  date: Date
  coversation_id: string
}
