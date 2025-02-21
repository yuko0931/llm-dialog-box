import { describe, it, expect, vi } from 'vitest'
import {
  createConversation,
  getConversationInfo,
  createMessage,
  getMessageList,
  getMessageInfo,
  updateMessage,
  deleteMessage,
} from './conversation'
import { client } from './client'
import { RoleType } from '@coze/api'

vi.mock('./client', () => ({
  client: {
    conversations: {
      create: vi.fn(),
      retrieve: vi.fn(),
      list: vi.fn(),
      clear: vi.fn(),
      messages: {
        create: vi.fn(),
        list: vi.fn(),
        retrieve: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    },
  },
  botId: 'test_bot_id',
}))

describe('Conversation Service', () => {
  // 创建空会话测试用例
  it('should create a conversation', async () => {
    const mock_meta_data = {
      uuid: 'newid1234',
    }

    const mockConversationResolved = {
      code: 0,
      data: {
        created_at: 1718289297,
        id: '737999610479815****',
        meta_data: mock_meta_data,
      },
      msg: '',
    }

    ;(client.conversations.create as vi.Mock).mockResolvedValue(mockConversationResolved)

    const result = await createConversation()
    expect(result).toEqual(mockConversationResolved)
    expect(client.conversations.create).toHaveBeenCalledWith({
      bot_id: expect.any(String),
      meta_data: expect.any(Object),
    })
  })

  // 通过会话 ID 查看会话信息测试用例
  it('should get conversation info', async () => {
    const mock_conversation_id = '737989918257813****'

    const mockConversationInfoResolved = {
      code: 0,
      data: {
        created_at: 1718266724,
        id: mock_conversation_id,
        meta_data: {},
      },
      msg: '',
    }

    ;(client.conversations.retrieve as vi.Mock).mockResolvedValue(mockConversationInfoResolved)

    const result = await getConversationInfo(mock_conversation_id)
    expect(result).toEqual(mockConversationInfoResolved)
    expect(client.conversations.retrieve).toHaveBeenCalledWith(mock_conversation_id)
  })

  // 在指定会话中创建消息测试用例
  it('should create a message', async () => {
    const mock_conversation_id = '737999610479815****'
    const mock_role = RoleType.User
    const mock_content_type = 'text'
    const mock_query = '早上好，今天星期几？'

    const createMessageResolved = {
      code: 0,
      data: {
        bot_id: '',
        chat_id: '',
        content: mock_query,
        content_type: mock_content_type,
        conversation_id: mock_conversation_id,
        created_at: 1718592898,
        id: '738130009748252****',
        meta_data: {},
        role: mock_role,
        type: '',
        updated_at: '1718592898',
      },
      msg: '',
    }

    ;(client.conversations.messages.create as vi.Mock).mockResolvedValue(createMessageResolved)

    const result = await createMessage(
      mock_conversation_id,
      mock_role,
      mock_content_type,
      mock_query,
    )

    expect(result).toEqual(createMessageResolved)
    expect(client.conversations.messages.create).toHaveBeenCalledWith(mock_conversation_id, {
      role: mock_role,
      content_type: mock_content_type,
      content: mock_query,
      meta_data: {},
    })
  })

  // 获取指定会话的消息列表测试用例
  it('should get message list', async () => {
    const mock_conversation_id = '737363834493434****'

    const messageListResolved = {
      code: 0,
      data: [
        {
          bot_id: '',
          chat_id: '',
          content: '你的名字叫什么',
          content_type: 'text',
          conversation_id: mock_conversation_id,
          created_at: 1716809829,
          id: '737363834493437****',
          meta_data: {},
          role: 'user',
          type: '',
          updated_at: '1716809829',
        },
        {
          bot_id: '',
          chat_id: '',
          content: '我的名字叫bot',
          content_type: 'text',
          conversation_id: mock_conversation_id,
          created_at: '1716809829',
          id: '737363834493440****',
          meta_data: {},
          role: 'assistant',
          type: '',
          updated_at: '1716936779',
        },
      ],
      first_id: '737363834493437****',
      has_more: true,
      last_id: '737363834493440****',
      msg: '',
    }
    ;(client.conversations.messages.list as vi.Mock).mockResolvedValue(messageListResolved)

    const result = await getMessageList(mock_conversation_id)
    expect(result).toEqual(messageListResolved)
    expect(client.conversations.messages.list).toHaveBeenCalledWith(mock_conversation_id)
  })

  // 通过会话 ID 和消息 ID 获取指定消息信息测试用例
  it('should get message info', async () => {
    const mock_conversation_id = '737999610479815****'
    const mock_message_id = '737999610479815****'

    const mockMessageInfoResolved = {
      code: 0,
      data: {
        bot_id: '',
        chat_id: '',
        content: '早上好，今天星期几？',
        content_type: 'text',
        conversation_id: mock_conversation_id,
        created_at: 1718595518,
        id: mock_message_id,
        meta_data: {},
        role: 'user',
        type: '',
        updated_at: '1718595518',
      },
      msg: '',
    }

    ;(client.conversations.messages.retrieve as vi.Mock).mockResolvedValue(mockMessageInfoResolved)

    const result = await getMessageInfo(mock_conversation_id, mock_message_id)
    expect(result).toEqual(mockMessageInfoResolved)
    expect(client.conversations.messages.retrieve).toHaveBeenCalledWith(
      mock_conversation_id,
      mock_message_id,
    )
  })

  // 修改消息测试用例
  it('should update a message', async () => {
    const mock_conversation_id = '737999610479815****'
    const mock_message_id = '738131140595115****'
    const mock_query = '早上好，今天深圳天气怎么样？'
    const mock_content_type = 'text'

    const mockUpdateMessageResolved = {
      code: 0,
      message: {
        bot_id: '',
        chat_id: '',
        content: mock_query,
        content_type: mock_content_type,
        conversation_id: mock_conversation_id,
        created_at: 1718595518,
        id: mock_message_id,
        meta_data: {},
        role: 'user',
        type: '',
        updated_at: '1718595677',
      },
      msg: '',
    }

    ;(client.conversations.messages.update as vi.Mock).mockResolvedValue(mockUpdateMessageResolved)

    try {
      const result = await updateMessage(
        mock_conversation_id,
        mock_message_id,
        mock_content_type,
        mock_query,
      )
      expect(result).toEqual(mockUpdateMessageResolved)
      expect(client.conversations.messages.update).toHaveBeenCalledWith(
        mock_conversation_id,
        mock_message_id,
        {
          content_type: mock_content_type,
          content: mock_query,
          meta_data: {},
        },
      )
    } catch (error) {
      throw new Error(`Unexpected error: ${error}`)
    }
  })

  // 删除消息测试用例
  it('should delete a message', async () => {
    const mock_conversation_id = '74076802623535*****'
    const mock_message_id = '738131140595115****'

    const mockDeleteMessageResolved = {
      code: 0,
      data: {
        bot_id: '73250261716436*****',
        chat_id: '74076802623535*****',
        content: '您好呀！今天感觉怎么样？',
        content_type: 'text',
        conversation_id: mock_conversation_id,
        created_at: 1724734970,
        id: mock_message_id,
        meta_data: {},
        role: 'assistant',
        type: 'answer',
        updated_at: 1724734971,
      },
      msg: '',
    }
    ;(client.conversations.messages.delete as vi.Mock).mockResolvedValue(mockDeleteMessageResolved)

    try {
      const result = await deleteMessage(mock_conversation_id, mock_message_id)
      expect(result).toEqual(mockDeleteMessageResolved)
      expect(client.conversations.messages.delete).toHaveBeenCalledWith(
        mock_conversation_id,
        mock_message_id,
      )
    } catch (error) {
      throw new Error(`Unexpected error: ${error}`)
    }
  })
})
