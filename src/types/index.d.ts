// 聊天消息类型
export interface chatMessage {
  role: 'user' | 'assistant'
  content: string
  content_type: 'text' | 'object_string' | 'card'
}

// 会话信息类型
export interface conversationInfo {
  title: string
  date: Date
  coversation_id: string
}

// 文件上传类型
export interface uploadFileItem {
  id: string
  name: string
  size: string
  isparsing: boolean
}
