// 聊天消息类型
export interface chatMessage {
  role: 'user' | 'assistant'
  content: string
}
