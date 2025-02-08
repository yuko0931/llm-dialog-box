import { ChatEventType, ChatStatus, type ChatV3Message, RoleType } from '@coze/api'
import { client, botId } from './client'

// 非流式对话
async function nonStreamingChat({ query }: { query: string }) {
  const v = await client.chat.createAndPoll({
    bot_id: botId,
    additional_messages: [
      {
        role: RoleType.User,
        content: query,
        content_type: 'text',
      },
    ],
  })

  if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages || []) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content)
    }
    console.log('usage', v.chat.usage)
  }

  return v.chat.id
}

// 流式对话
async function streamingChat({
  query,
  conversation_id,
  callback,
  onChatCreated,
  isCancelled,
}: {
  query: string
  conversation_id: string
  callback?: (v: ChatV3Message) => void
  onChatCreated?: (chatId: string) => void
  isCancelled: () => boolean
}) {
  const v = await client.chat.stream({
    bot_id: botId,
    auto_save_history: true,
    conversation_id,
    additional_messages: [
      {
        role: RoleType.User,
        content: query,
        content_type: 'text',
      },
    ],
  })

  for await (const part of v) {
    if (isCancelled()) {
      break // 如果取消标志位为 true，终止循环
    }
    if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
      console.log('[START]')
      console.log(part.data)
      if (onChatCreated) {
        onChatCreated(part.data.id)
      }
    } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      if (callback) {
        callback(part.data)
      }
      // console.log('[DELTA]')
      // console.log(part.data.content)
    } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
      const { role, type, content } = part.data
      if (role === 'assistant' && type === 'answer') {
        console.log('')
      } else {
        console.log('[%s]:[%s]:%s', role, type, content)
      }
    } else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
      console.log(part.data.usage)
    } else if (part.event === ChatEventType.DONE) {
      console.log(part.data)
    } else if (part.event === ChatEventType.ERROR) {
      console.error(part.data)
    }
  }
  console.log('=== End of Streaming Chat ===')
}

async function cancelstreamingChat({
  conversation_id,
  chat_id,
}: {
  conversation_id: string
  chat_id: string
}) {
  return await client.chat.cancel(conversation_id, chat_id)
}

export { nonStreamingChat, streamingChat, cancelstreamingChat }
