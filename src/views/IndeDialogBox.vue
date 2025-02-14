<template>
  <div class="container">
    <Sidebar />
    <!-- 使用 Sidebar 组件 -->
    <div class="main-wrapper">
      <div class="header">{{ curTitle }}</div>
      <div class="chat-wrapper">
        <div class="chat-list" v-show="!showTip" ref="chatListRef">
          <div v-for="(message, index) in messages" :key="index">
            <MyQuestion :message="message.content" v-show="message.role === 'user'"></MyQuestion>
            <LLMAnswer
              :answer="message.content"
              v-show="message.role === 'assistant'"
              :isStreaming="isStreaming"
              :isLast="index === messages.length - 1"
            ></LLMAnswer>
          </div>
          <!-- 如果正在接收流式数据，显示当前正在构建的llm回答 -->
          <!-- 使用 keep-alive 缓存流式内容 -->
          <keep-alive>
            <LLMAnswer
              :answer="currentAnswer"
              :isStreaming="isStreaming"
              v-show="isStreaming"
            ></LLMAnswer>
          </keep-alive>
        </div>
        <!--输入框-->
        <div class="input-box" :class="{ fixed: isFixed }">
          <div class="tip" v-if="showTip">有什么可以帮忙的？</div>
          <div class="input-wrapper">
            <div class="textarea-wrapper">
              <textarea
                v-model="inputMessage"
                name="input-area"
                placeholder="请输入要询问的问题"
                id="input-area"
                @keydown.enter="handleKeydownEnter"
              ></textarea>
            </div>
            <div class="button-wrapper">
              <div class="attach btn" @click="handleUploadAttach">
                <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.svg,.svgz,.bmp,.gif,.webp,.ico,.xbm,.dib,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md"
                  style="display: none"
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 20" fill="none">
                  <path
                    d="M7 20c-1.856-.002-3.635-.7-4.947-1.94C.74 16.819.003 15.137 0 13.383V4.828a4.536 4.536 0 0 1 .365-1.843 4.75 4.75 0 0 1 1.087-1.567A5.065 5.065 0 0 1 3.096.368a5.293 5.293 0 0 1 3.888 0c.616.244 1.174.6 1.643 1.05.469.45.839.982 1.088 1.567.25.586.373 1.212.364 1.843v8.555a2.837 2.837 0 0 1-.92 2.027A3.174 3.174 0 0 1 7 16.245c-.807 0-1.582-.3-2.158-.835a2.837 2.837 0 0 1-.92-2.027v-6.22a1.119 1.119 0 1 1 2.237 0v6.22a.777.777 0 0 0 .256.547.868.868 0 0 0 .585.224c.219 0 .429-.08.586-.224a.777.777 0 0 0 .256-.546V4.828A2.522 2.522 0 0 0 7.643 3.8a2.64 2.64 0 0 0-.604-.876 2.816 2.816 0 0 0-.915-.587 2.943 2.943 0 0 0-2.168 0 2.816 2.816 0 0 0-.916.587 2.64 2.64 0 0 0-.604.876 2.522 2.522 0 0 0-.198 1.028v8.555c0 1.194.501 2.339 1.394 3.183A4.906 4.906 0 0 0 7 17.885a4.906 4.906 0 0 0 3.367-1.319 4.382 4.382 0 0 0 1.395-3.183v-6.22a1.119 1.119 0 0 1 2.237 0v6.22c-.002 1.754-.74 3.436-2.052 4.677C10.635 19.3 8.856 19.998 7 20z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div
                class="send btn"
                v-show="!isStreaming"
                :class="inputMessage.trim() ? 'active' : ''"
                @click="handleSendMessage"
              >
                <svg
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7 16c-.595 0-1.077-.462-1.077-1.032V1.032C5.923.462 6.405 0 7 0s1.077.462 1.077 1.032v13.936C8.077 15.538 7.595 16 7 16z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M.315 7.44a1.002 1.002 0 0 1 0-1.46L6.238.302a1.11 1.11 0 0 1 1.523 0c.421.403.421 1.057 0 1.46L1.838 7.44a1.11 1.11 0 0 1-1.523 0z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.685 7.44a1.11 1.11 0 0 1-1.523 0L6.238 1.762a1.002 1.002 0 0 1 0-1.46 1.11 1.11 0 0 1 1.523 0l5.924 5.678c.42.403.42 1.056 0 1.46z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div class="stop btn" v-show="isStreaming" @click="handleStopStreaming">
                <div class="box"></div>
              </div>
            </div>
          </div>
          <div class="bottom-info" v-if="!showTip">内容由 AI 生成，请仔细甄别</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import MyQuestion from '@/components/MyQuestion.vue'
import LLMAnswer from '@/components/LLMAnswer.vue'
import Sidebar from '@/components/SiderBar.vue' // 导入 Sidebar 组件
import { streamingChat, cancelstreamingChat } from '@/service/chat'
import { createConversation, getMessageList } from '@/service/conversation'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'

const store = useStore()
const { isRegenerate, showTip, firstSend, conversation_id, curTitle, messages, conversationList } =
  storeToRefs(store)

const inputMessage = ref<string>('') // 输入框的值
const isFixed = ref<boolean>(false) // 控制输入框是否固定在底部
const fileInput = ref<HTMLInputElement | null>(null) // 获取文件选择框的引用
const currentAnswer = ref<string>('') // 当前正在构建的llm回答
const isStreaming = ref<boolean>(false) // 是否正在接收流式数据

const cur_chat_id = ref<string>('') // 当前对话的id
const isCancelled = ref<boolean>(false) // 是否取消了流式数据输出
const chatListRef = ref<HTMLElement | null>(null) // 获取聊天列表的引用
const autoScroll = ref<boolean>(true) // 是否自动滚动

const handleSendMessage = async () => {
  const query = inputMessage.value.trim()
  if (!query) return
  console.log(query)

  // 第一次发送消息时，创建会话，更新一些状态变量
  if (!firstSend.value) {
    const conversation_result = await createConversation()
    conversation_id.value = conversation_result.id
    conversationList.value.unshift({
      title: query,
      date: new Date(),
      coversation_id: conversation_result.id,
    })
    localStorage.setItem('conversationList', JSON.stringify(conversationList.value))
    firstSend.value = true
    showTip.value = false
    isFixed.value = true
    curTitle.value = query
  }

  messages.value.push({ role: 'user', content: query })
  inputMessage.value = ''
  await generateChat(query)
}

// 抽离函数，生成聊天内容
const generateChat = async (query: string) => {
  // 重置当前回答和流式状态
  currentAnswer.value = ''
  isStreaming.value = true
  isCancelled.value = false // 发起新对话时重置取消标志位
  autoScroll.value = true

  nextTick(() => {
    chatListRef.value?.scrollTo({ top: chatListRef.value.scrollHeight, behavior: 'smooth' })
  })

  await streamingChat({
    query,
    conversation_id: conversation_id.value,
    callback: (data) => {
      if (data.role === 'assistant' && !isCancelled.value) {
        // 检查取消标志位
        currentAnswer.value += data.content || ''
      }
    },
    onChatCreated(chat_id) {
      cur_chat_id.value = chat_id
      console.log('chat created:', chat_id)
    },
    isCancelled: () => isCancelled.value,
  })

  // 流式对话结束后，将完整的回答添加到消息列表
  if (!isCancelled.value) {
    messages.value.push({ role: 'assistant', content: currentAnswer.value })
    isStreaming.value = false
  }

  const result = await getMessageList(conversation_id.value)
  console.log('message list:', result)
}

const handleStopStreaming = async () => {
  isCancelled.value = true // 设置取消标志位
  const result = await cancelstreamingChat({
    conversation_id: conversation_id.value,
    chat_id: cur_chat_id.value,
  })
  console.log('canceled chat info:', result)
  messages.value.push({ role: 'assistant', content: currentAnswer.value })
  currentAnswer.value = ''
  isStreaming.value = false
}

const handleUploadAttach = () => {
  console.log('上传附件中')
  fileInput.value?.click()
}

// 监听用户滚动
const handleUserScroll = () => {
  if (chatListRef.value) {
    // 判断用户是否手动滚动
    if (
      chatListRef.value.scrollTop + chatListRef.value.clientHeight <
      chatListRef.value.scrollHeight - 30
    ) {
      autoScroll.value = false
    } else {
      autoScroll.value = true
    }
  }
}

// 处理回车键事件
const handleKeydownEnter = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault() // 阻止默认的回车换行行为
    handleSendMessage() // 触发发送消息逻辑
  }
}

onMounted(() => {
  if (chatListRef.value) {
    chatListRef.value.addEventListener('scroll', handleUserScroll)
  }
})

onUnmounted(() => {
  if (chatListRef.value) {
    chatListRef.value.addEventListener('scroll', handleUserScroll)
  }
})

// 监听 isRegenerate 变量，当它变化时，重新生成最后一条消息的回答
watch(
  () => isRegenerate.value,
  async () => {
    const query = messages.value[messages.value.length - 2].content
    messages.value.pop()
    await generateChat(query)
  },
)

// 监听 currentAnswer 变量，当它变化时(开始生成llm回答，自动滚动到底部
watch(currentAnswer, () => {
  // 如果自动滚动，则滚动到底部
  if (chatListRef.value && autoScroll.value) {
    chatListRef.value.scrollTop = chatListRef.value.scrollHeight
  }
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;

  .side {
    width: 260px;
    height: 100%;
    background-color: #171717;
    color: #fff;
  }

  .main-wrapper {
    flex: 1 1 0%;
    background-color: #212121;
    color: #fff;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    .header {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      overflow: hidden;
    }

    .chat-wrapper {
      height: calc(100% - 60px);
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-grow: 1;

      .chat-list {
        width: 100%;
        flex: 1 1;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        overflow: auto;
        border: none;

        div {
          width: 100%;
          max-width: 48rem;
        }
      }

      .input-box.fixed {
        position: sticky;
        bottom: 0;
      }

      .input-box {
        width: 100%;
        max-width: 48rem;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        background-color: #212121;

        .tip {
          margin-bottom: 1.75rem;
          font-size: 1.875rem;
          font-weight: 600;
          line-height: 2.25rem;
        }

        .input-wrapper {
          box-sizing: border-box;
          width: 100%;
          padding: 10px;
          border: transparent;
          border-radius: 24px;
          background-color: #292a2d;
          display: flex;
          flex-flow: column nowrap;
          overflow: hidden;

          .textarea-wrapper {
            width: 100%;
            margin: 0 4px;
            position: relative;

            textarea {
              width: 100%;
              color: rgb(245, 245, 245);
              line-height: 28px;
              font-size: 16px;
              font-family: 'Inter';
              background-color: transparent;
              word-break: break-word;
              white-space: pre-wrap;
            }
          }

          .button-wrapper {
            display: flex;
            justify-content: flex-end;
            align-items: center;

            .btn {
              height: 32px;
              width: 32px;
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
            }

            .stop {
              background-color: rgb(113 113 122);
              border-radius: 50%;
            }

            .box {
              width: 12px;
              height: 12px;
              margin: 1px;
              background: #ccc;
            }

            .attach {
              margin-right: 10px;

              svg {
                width: 23px;
                height: 23px;
              }
            }

            .send.active {
              background-color: #ccc;
            }

            .send {
              color: #4b4b5b;
              background-color: rgb(113 113 122);
              border-radius: 50%;

              svg {
                width: 16px;
                height: 16px;
              }
            }
          }
        }

        .bottom-info {
          color: #737373;
          font-size: 12px;
          padding: 6px 0;
        }
      }
    }
  }
}
</style>
