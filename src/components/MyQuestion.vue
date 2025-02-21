<template>
  <div class="file-container">
    <div class="file-item" v-for="item in files" :key="item.id">
      <div class="file-view"><img :src="getFilePath(item.name)" alt="file" /></div>
      <div class="file-detail">
        <div class="file-name">{{ item.name }}</div>
        <div class="file-size">{{ item.size }}</div>
      </div>
    </div>
  </div>

  <div
    class="question-container"
    v-if="!isEditing"
    @mouseenter="isShowEdit = true"
    @mouseleave="isShowEdit = false"
  >
    <div
      :style="{ visibility: isShowEdit ? 'visible' : 'hidden' }"
      class="edit-btn"
      @click="startEditing"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.2286 17.3545H1.77142C1.34538 17.3545 1 17.6999 1 18.1259C1 18.552 1.34538 18.8973 1.77142 18.8973H18.2286C18.6546 18.8973 19 18.552 19 18.1259C19 17.6999 18.6546 17.3545 18.2286 17.3545Z"
          fill="currentColor"
        ></path>
        <mask id="mask0_400_418" maskUnits="userSpaceOnUse" x="1" y="1" width="15" height="15">
          <path d="M15.1429 1.10254H1V15.2454H15.1429V1.10254Z" fill="white"></path>
        </mask>
        <g mask="url(#mask0_400_418)">
          <path
            d="M2.48999 15.2425C2.36999 15.2425 2.26002 15.2225 2.15002 15.2025C2.04002 15.1725 1.94003 15.1325 1.84003 15.0825C1.73003 15.0325 1.63999 14.9825 1.54999 14.9025C1.45999 14.8325 1.39001 14.7525 1.32001 14.6625C1.25001 14.5825 1.19001 14.4825 1.14001 14.3825C1.09001 14.2825 1.05003 14.1725 1.03003 14.0625C1.01003 13.9525 1 13.8425 1 13.7225C1 13.6125 1.00998 13.5025 1.03998 13.3925L1.75 10.4325C1.9 9.81254 2.20001 9.28253 2.64001 8.83253L9.40002 2.08253C9.55002 1.92253 9.71997 1.78254 9.90997 1.66254C10.09 1.54254 10.28 1.44254 10.49 1.35254C10.69 1.27254 10.9 1.20254 11.12 1.16254C11.33 1.12254 11.55 1.10254 11.77 1.10254C12 1.10254 12.21 1.12254 12.43 1.16254C12.65 1.20254 12.86 1.27254 13.06 1.35254C13.27 1.44254 13.46 1.54254 13.64 1.66254C13.83 1.78254 14 1.92253 14.15 2.08253C14.31 2.24253 14.45 2.41254 14.57 2.59254C14.69 2.77254 14.79 2.97255 14.88 3.17255C14.96 3.37255 15.03 3.59254 15.07 3.80254C15.11 4.02254 15.13 4.24254 15.13 4.46254C15.13 4.68254 15.11 4.90253 15.07 5.11253C15.03 5.33253 14.96 5.54254 14.88 5.74254C14.79 5.95254 14.69 6.14254 14.57 6.32254C14.45 6.51254 14.31 6.68253 14.15 6.83253L7.40002 13.5925C6.95002 14.0425 6.42 14.3325 5.81 14.4825L2.84003 15.1925C2.73003 15.2225 2.60999 15.2425 2.48999 15.2425ZM11.67 2.73254C11.22 2.76254 10.84 2.94254 10.52 3.26254L3.78998 9.99254C3.55998 10.2225 3.41002 10.4925 3.33002 10.8125L2.66998 13.5625L5.42999 12.9025C5.73999 12.8225 6.02 12.6725 6.25 12.4425L13 5.68254C13.08 5.60254 13.15 5.52255 13.22 5.42255C13.28 5.33255 13.33 5.23254 13.38 5.12254C13.42 5.02254 13.45 4.91254 13.47 4.80254C13.5 4.68254 13.51 4.57254 13.51 4.46254C13.51 4.34254 13.5 4.23254 13.47 4.12254C13.45 4.01254 13.42 3.90254 13.38 3.79254C13.33 3.69254 13.28 3.59254 13.22 3.49254C13.15 3.40254 13.08 3.31254 13 3.23254C12.82 3.06254 12.62 2.92254 12.39 2.84254C12.16 2.75254 11.91 2.71254 11.67 2.73254Z"
            fill="currentColor"
          ></path>
        </g>
      </svg>
    </div>
    <div ref="questionContent" class="content">
      {{ message }}
    </div>
  </div>
  <div class="edit-container" v-else>
    <div class="textarea-wrapper" @keydown.enter="handleKeydownEnter">
      <textarea ref="inputRef" v-model="editedMessage" class="edit-input" placeholder=""></textarea>
    </div>
    <div class="func-btn">
      <div class="btn" @click="cancelEditing">取消</div>
      <div class="btn" @click="saveEditing">发送</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { deleteMessage } from '@/service/conversation'
import type { uploadFileItem } from '@/types/index'
const store = useStore()
const { messages, detailMessageList, conversation_id } = storeToRefs(store)

const questionContent = ref<HTMLDivElement | null>(null) // 用户输入的文本元素引用
const inputRef = ref<HTMLTextAreaElement | null>(null) // 输入框引用
const isShowEdit = ref(false) // 是否显示编辑按钮
const isEditing = ref(false) // 是否处于编辑模式
const editedMessage = ref('') // 编辑后的内容
const { message } = defineProps<{
  // props
  message: string
  files: uploadFileItem[]
}>()

const getFilePath = (name: string) => {
  const basepath = '/img/'
  const imageExtensions = ['jpg', 'png', 'gif', 'webp', 'bmp', 'pcd', 'tiff']
  // 获取文件名后缀（统一转小写
  const extension = name?.toLowerCase()?.split('.')?.pop() || ''
  const filetype = imageExtensions.includes(extension) ? 'img' : 'file'
  return basepath + filetype + '.svg'
}

const emit = defineEmits(['generate-chat'])

// 开始编辑
const startEditing = () => {
  isEditing.value = true
  editedMessage.value = message
  nextTick(() => {
    inputRef.value?.focus() // 聚焦输入框
  })
}

// 保存编辑
const saveEditing = () => {
  isEditing.value = false
  const index = messages.value.findIndex((item) => item.content === message)
  if (index !== -1) {
    messages.value.splice(index, 2)
  }
  const chat_id = detailMessageList.value.find((item) => item.content === message)!.chat_id
  const deleteMessageId = detailMessageList.value.find((item) => item.content === message)!.id
  const deleteAnswerId = detailMessageList.value.find(
    (item) => item.chat_id === chat_id && item.type === 'answer',
  )!.id
  // console.log("deleteMessageId:", deleteMessageId)
  // console.log("deleteAnswerId:", deleteAnswerId)
  deleteMessage(conversation_id.value, deleteMessageId)
  deleteMessage(conversation_id.value, deleteAnswerId)
  messages.value.push({
    role: 'user',
    content: editedMessage.value,
    content_type: 'text',
  })
  emit('generate-chat', editedMessage.value)
}

// 处理回车键事件
const handleKeydownEnter = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault() // 阻止默认的回车换行行为
    saveEditing() // 触发发送消息逻辑
  }
}

// 取消编辑
const cancelEditing = () => {
  isEditing.value = false
  editedMessage.value = message // 恢复原始内容
}
</script>

<style lang="scss" scoped>
.file-container {
  display: flex;
  justify-content: flex-end;
  flex-flow: row wrap;
  gap: 10px;
  padding: 10px 0;

  .file-item {
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: #404045;
    border-radius: 8px;
    height: 45px;
    width: 225px;
    padding: 9px 6px;
    display: flex;
    align-items: center;

    .file-view {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }

    .file-detail {
      flex: 1;

      .file-name {
        min-height: 20px;
        max-width: 180px;
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .file-size {
        color: #bbb;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 0;
        font-size: 12px;
        line-height: 17px;
        overflow: hidden;
      }
    }
  }
}

.question-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;

  .edit-btn {
    box-sizing: border-box;
    height: 28px;
    width: 28px;
    padding: 5px;
    margin-top: 5px;
    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: rgba(50, 50, 50, 0.85);
    }
  }

  .content {
    box-sizing: border-box;
    max-width: calc(100% - 28px);
    padding: 0.625rem 1.25rem;
    margin-left: 10px;
    line-height: 28px;
    white-space: pre-wrap;
    word-break: break-word;
    color: #f8faff;
    border-radius: 14px;
    background-color: rgba(50, 50, 50, 0.85);
  }
}

.edit-container {
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  width: 100%;
  margin-bottom: 32px;

  .textarea-wrapper {
    box-sizing: border-box;
    background-color: rgba(50, 50, 50, 0.85);
    border-radius: 14px;
    margin-bottom: 15px;
    padding: 0.625rem 1.25rem;

    textarea {
      width: 100%;
      height: 108px;
      min-height: 33px;
      max-height: 108px;
      color: rgb(245, 245, 245);
      line-height: 28px;
      font-size: 16px;
      font-family: 'Inter';
      background-color: transparent;
      word-break: break-word;
      white-space: pre-wrap;
    }
  }

  .func-btn {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .btn {
      background-color: #3a3a46;
      border-radius: 14px;
      padding: 0 14px;
      color: #f8faff;
      height: 34px;
      width: 28px;
      font-size: 14px;
      line-height: 34px;

      &:hover {
        cursor: pointer;
        background-color: #31313d;
      }
    }
  }
}
</style>
