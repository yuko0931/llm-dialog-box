import type { ComponentPublicInstance } from 'vue'
import { createVNode, render } from 'vue'
import MessageComponent from './Message.vue'

const messageTypes = ['success', 'warning', 'error', 'info'] as const
type MessageType = typeof messageTypes[number]

interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
}

const Message = (options: MessageOptions | string) => {
  const messageOptions = typeof options === 'string'
    ? { message: options }
    : options

  // 创建容器
  const container = document.createElement('div')

  // 创建vnode
  const vnode = createVNode(MessageComponent, {
    message: messageOptions.message,
    type: messageOptions.type || 'info',
    duration: messageOptions.duration ?? 3000,
  })

  // 渲染组件
  render(vnode, container)
  document.body.appendChild(container)

  // 清理函数
  const destroy = () => {
    render(null, container)
    document.body.removeChild(container)
  }

  // 监听动画结束后销毁
  const vm = vnode.component!
  vm.props.onDestroy = () => {
    destroy()
  }
}

// 添加类型方法
messageTypes.forEach(type => {
  Message[type] = (options: MessageOptions | string) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

export default Message
