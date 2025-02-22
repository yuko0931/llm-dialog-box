import { beforeEach, describe, it, expect, vi } from 'vitest'
import { nonStreamingChat, streamingChat, cancelstreamingChat } from '../../service/chat'
import { client } from '../../service/client'
import { RoleType, ChatEventType } from '@coze/api'

// 创建模拟模块
vi.mock('../../service/client', () => ({
  client: {
    chat: {
      createAndPoll: vi.fn(),
      stream: vi.fn(),
      cancel: vi.fn(),
    },
  },
  botId: 'test_bot_id',
}))

// 测试 nonStreamingChat 方法
describe('nonStreamingChat service test', () => {
  let mock_query: string
  let mock_chat_id: string
  let mock_bot_id: string
  let mock_conversation_id: string
  let mock_user: RoleType

  beforeEach(() => {
    mock_query = '2024年10月1日是星期几'
    mock_chat_id = '123'
    mock_bot_id = 'test_bot_id'
    mock_conversation_id = '123456'
    mock_user = RoleType.User
  })

  it('should return chat id when chat is completed', async () => {
    const mockResponse = {
      chat: {
        id: mock_chat_id,
        conversation_id: mock_conversation_id,
        bot_id: mock_bot_id,
        status: 'completed',
        created_at: 1710348675,
        completed_at: 1710348675,
        last_error: null,
        meta_data: {},
        usage: {
          token_count: 110,
          output_count: 50,
          input_count: 60,
        },
      },
      usage: {
        token_count: 92,
        output_count: 41,
        input_count: 51,
      },
      messages: [
        {
          id: '7382159494123470858',
          conversation_id: mock_conversation_id,
          bot_id: mock_bot_id,
          chat_id: mock_chat_id,
          meta_data: {},
          role: RoleType.Assistant,
          content:
            '2024年10月1日是星期二。可通过手机中的日历软件直接查看，也可以通过蔡氏公式等计算星期几的公式来进行推算。',
          content_type: 'text',
          created_at: 1710348675,
          updated_at: 1710348675,
          type: 'answer',
        },
      ],
    }

    ;(client.chat.createAndPoll as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse)
    try {
      const result = await nonStreamingChat({ query: mock_query })

      const expectedRequest = {
        bot_id: mock_bot_id,
        additional_messages: [
          {
            role: mock_user,
            content: mock_query,
            content_type: 'text',
          },
        ],
      }

      expect(client.chat.createAndPoll).toHaveBeenCalledWith(expectedRequest)
      expect(result).toBe(mock_chat_id)
    } catch (error) {
      throw new Error(`Unexpected error: ${error}`)
    }
  })
})

// 测试 streamingChat 方法
describe('streamingChat service test', () => {
  let mock_query: string
  let mock_chat_id: string
  let mock_bot_id: string
  let mock_conversation_id: string
  let mock_user: RoleType

  beforeEach(() => {
    mock_query = '2024年10月1日是星期几'
    mock_chat_id = '7382159487131697202'
    mock_bot_id = 'test_bot_id'
    mock_conversation_id = '7381473525342978089'
    mock_user = RoleType.User
  })

  it('should handle CONVERSATION_CHAT_CREATED event', async () => {
    let onChatCreatedCalled = false

    const mockStreamResult = {
      [Symbol.asyncIterator]: () => {
        let index = 0
        const parts = [
          {
            event: ChatEventType.CONVERSATION_CHAT_CREATED,
            data: { id: mock_chat_id },
          },
        ]
        return {
          next: async () => {
            if (index < parts.length) {
              return { value: parts[index++], done: false }
            }
            return { done: true }
          },
        }
      },
    }

    ;(client.chat.stream as ReturnType<typeof vi.fn>).mockResolvedValue(mockStreamResult)

    try {
      await streamingChat({
        final_query: mock_query,
        content_type: 'text',
        conversation_id: mock_conversation_id,
        callback: () => {},
        onChatCreated: (chatId) => {
          onChatCreatedCalled = true
          expect(chatId).toBe(mock_chat_id)
        },
        isCancelled: () => false,
      })

      expect(onChatCreatedCalled).toBe(true)
      expect(client.chat.stream).toHaveBeenCalledWith({
        bot_id: mock_bot_id,
        auto_save_history: true,
        conversation_id: mock_conversation_id,
        additional_messages: [
          {
            role: mock_user,
            content: mock_query,
            content_type: 'text',
          },
        ],
      })
    } catch (error) {
      throw new Error(`Unexpected error: ${error}`)
    }
  })
})

// 测试 cancelstreamingChat 方法
describe('cancelstreamingChat service test', () => {
  it('should call client.chat.cancel with correct parameters and return its result', async () => {
    const mock_conversation_id = '74076802623535*****'
    const mock_chat_id = '74076802623535*****'
    const mockResult = {
      code: 0,
      data: {
        bot_id: '73250261716436*****',
        chat_id: mock_chat_id,
        content: '您好呀！今天感觉怎么样？',
        content_type: 'text',
        conversation_id: mock_conversation_id,
        created_at: 1724734970,
        id: '74076802623536*****',
        meta_data: {},
        role: 'assistant',
        type: 'answer',
        updated_at: 1724734971,
      },
      msg: '',
    }

    ;(client.chat.cancel as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult)

    try {
      const result = await cancelstreamingChat({
        conversation_id: mock_conversation_id,
        chat_id: mock_chat_id,
      })
      expect(client.chat.cancel).toHaveBeenCalledWith(mock_conversation_id, mock_chat_id)
      expect(result).toEqual(mockResult)
    } catch (error) {
      throw new Error(`Unexpected error: ${error}`)
    }
  })
})
