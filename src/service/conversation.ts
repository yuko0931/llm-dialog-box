import { botId, client } from './client.ts'
import { RoleType, type ContentType } from '@coze/api'

// 创建会话
async function createConversation() {
  const conversation = await client.conversations.create({
    bot_id: botId,
    meta_data: {},
  })
  return conversation
}

// 获取具体会话信息
async function getConversationInfo(conversation_id: string) {
  const conversation = await client.conversations.retrieve(conversation_id)
  return conversation
}

// 获取所有会话列表
async function getConversationList() {
  const conversations = await client.conversations.list({
    bot_id: botId,
  })
  return conversations
}

// 清空会话内容
async function clearConversation(conversation_id: string) {
  const conversation = await client.conversations.clear(conversation_id)
  return conversation
}

/***************** 会话中消息相关接口 *****************/
// 创建消息
async function createMessage(
  conversation_id: string,
  role: RoleType,
  content_type: ContentType,
  query: string,
) {
  const message = await client.conversations.messages.create(conversation_id, {
    role: role,
    content: query,
    content_type: content_type,
    meta_data: {},
  })
  return message
}

// 获取指定会话的消息列表
async function getMessageList(conversation_id: string) {
  const messages = await client.conversations.messages.list(conversation_id)
  return messages
}

// 查看消息详情
async function getMessageInfo(conversation_id: string, message_id: string) {
  const message = await client.conversations.messages.retrieve(conversation_id, message_id)
  return message
}

// 修改消息
async function updateMessage(
  conversation_id: string,
  message_id: string,
  content_type: ContentType,
  query: string,
) {
  const message = await client.conversations.messages.update(conversation_id, message_id, {
    meta_data: {},
    content: query,
    content_type: content_type,
  })
  return message
}

// 删除消息
async function deleteMessage(conversation_id: string, message_id: string) {
  const result = await client.conversations.messages.delete(conversation_id, message_id)
  return result
}

export {
  createConversation,
  getConversationInfo,
  getConversationList,
  clearConversation,
  createMessage,
  getMessageList,
  getMessageInfo,
  updateMessage,
  deleteMessage,
}
