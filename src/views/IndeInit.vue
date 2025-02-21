<template>
  <div class="input-box">
    <div class="tip">有什么可以帮忙的？</div>
    <div class="input-wrapper">
      <div class="filearea-wrapper" v-if="uploadFiles.length > 0">
        <div v-for="(file, index) in uploadFiles" :key="index">
          <UploadFileView
            :name="file.name"
            :size="file.size"
            :isparsing="file.isparsing"
            @delete-file="deleteFile"
          />
        </div>
      </div>
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
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.csv,.jpg,.png,.gif,.webp,.bmp,.pcd,.tiff"
          style="display: none"
          @change="handleFileChange"
        />
        <div class="attach btn" @click="handleUploadAttach">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 20" fill="none">
            <path
              d="M7 20c-1.856-.002-3.635-.7-4.947-1.94C.74 16.819.003 15.137 0 13.383V4.828a4.536 4.536 0 0 1 .365-1.843 4.75 4.75 0 0 1 1.087-1.567A5.065 5.065 0 0 1 3.096.368a5.293 5.293 0 0 1 3.888 0c.616.244 1.174.6 1.643 1.05.469.45.839.982 1.088 1.567.25.586.373 1.212.364 1.843v8.555a2.837 2.837 0 0 1-.92 2.027A3.174 3.174 0 0 1 7 16.245c-.807 0-1.582-.3-2.158-.835a2.837 2.837 0 0 1-.92-2.027v-6.22a1.119 1.119 0 1 1 2.237 0v6.22a.777.777 0 0 0 .256.547.868.868 0 0 0 .585.224c.219 0 .429-.08.586-.224a.777.777 0 0 0 .256-.546V4.828A2.522 2.522 0 0 0 7.643 3.8a2.64 2.64 0 0 0-.604-.876 2.816 2.816 0 0 0-.915-.587 2.943 2.943 0 0 0-2.168 0 2.816 2.816 0 0 0-.916.587 2.64 2.64 0 0 0-.604.876 2.522 2.522 0 0 0-.198 1.028v8.555c0 1.194.501 2.339 1.394 3.183A4.906 4.906 0 0 0 7 17.885a4.906 4.906 0 0 0 3.367-1.319 4.382 4.382 0 0 0 1.395-3.183v-6.22a1.119 1.119 0 0 1 2.237 0v6.22c-.002 1.754-.74 3.436-2.052 4.677C10.635 19.3 8.856 19.998 7 20z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div
          class="send btn"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UploadFileView from '@/components/UploadFileView.vue'

import { ref } from 'vue'
import { useStore } from '@/stores/index'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { createConversation } from '@/service/conversation'
import { uploadFile } from '@/service/file'
import { formatFileSize } from '@/utils/index'
import type { uploadFileItem } from '@/types/index'

const store = useStore()
const { firstSendQuery, firstSendFiles, conversationList, curTitle } = storeToRefs(store)

const router = useRouter()

const inputMessage = ref<string>('') // 输入框的值
const fileInput = ref<HTMLInputElement | null>(null) // 获取文件选择框的引用
const uploadFiles = ref<uploadFileItem[]>([]) // 上传的文件列表

const handleSendMessage = async () => {
  const query = inputMessage.value.trim()
  inputMessage.value = ''
  if (!query) return
  console.log(query)
  const files = uploadFiles.value
  uploadFiles.value = []

  const conversation_result = await createConversation()
  const conversation_id = conversation_result.id

  if (!curTitle.value) {
    curTitle.value = query.length > 30 ? `${query.substring(0, 30)}` : query
  }

  // 更新侧边栏的列表
  conversationList.value.unshift({
    title: curTitle.value,
    date: new Date(),
    coversation_id: conversation_result.id,
  })

  localStorage.setItem('conversationList', JSON.stringify(conversationList.value))

  firstSendQuery.value = query
  firstSendFiles.value = files
  router.push({
    name: 'chat',
    params: {
      conversationdId: conversation_id,
    },
  })
}
// 处理回车键事件
const handleKeydownEnter = (event: KeyboardEvent) => {
  if (!event.shiftKey) {
    event.preventDefault() // 阻止默认的回车换行行为
    handleSendMessage() // 触发发送消息逻辑
  }
}

const handleUploadAttach = () => {
  console.log('上传附件中')
  fileInput.value?.click()
}

// 处理文件选择
const handleFileChange = async () => {
  if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0) {
    const files = Array.from(fileInput.value.files)
    console.log('文件列表:', files)
    for (const file of files) {
      if (uploadFiles.value.find((item) => item.name === file.name)) {
        console.log('不要上传重复的文件!')
        continue
      }

      uploadFiles.value.push({
        id: '',
        name: file.name,
        size: formatFileSize(file.size),
        isparsing: false,
      })
      const result = await uploadFile(file)
      uploadFiles.value = uploadFiles.value.map((item) => {
        if (item.name === file.name) {
          item.isparsing = true
          item.id = result.id
        }
        return item
      })
      console.log('上传文件结果:', result)
      // 清空文件选择框的值,以便下次选择相同文件时也能触发
      fileInput.value.value = ''
    }
  }
}

// 删除文件
const deleteFile = (name: string) => {
  const index = uploadFiles.value.findIndex((item) => item.name === name)
  if (index !== -1) {
    uploadFiles.value.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
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

    .filearea-wrapper {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      gap: 8px;
      margin-bottom: 10px;
    }

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
}
</style>
