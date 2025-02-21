<script setup lang="ts">
import { ref } from 'vue'
import DeleteDialog from './DeleteDialog.vue'

const props = defineProps<{
  visible: boolean
  conversationId: string
  title: string
  onClose: () => void
  position?: { x: number; y: number }
}>()

// 处理重命名
const handleRename = () => {
  // 找到对应的会话元素
  const conversationElement = document.querySelector(
    `[data-conversation-id="${props.conversationId}"] .conversation-title`,
  )
  if (conversationElement) {
    // 直接触发双击事件处理函数
    conversationElement.dispatchEvent(
      new MouseEvent('dblclick', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    )
  }
  props.onClose()
}

// 处理删除
const showDeleteDialog = ref(false)
const handleDelete = () => {
  showDeleteDialog.value = true
  // 移除立即关闭MoreDialog的逻辑，等待用户在DeleteDialog中确认或取消
}

const handleClose = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains('dialog-overlay')) {
    props.onClose()
  }
}
</script>

<template>
  <div v-if="visible" class="dialog-overlay" @click="handleClose">
    <div
      class="dialog-content"
      :style="{
        left: position?.x + 'px',
        top: position?.y + 'px',
      }"
    >
      <div class="dialog-options">
        <div class="dialog-option" @click="handleRename">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
          重命名
        </div>
        <div class="dialog-option delete" @click="handleDelete">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
          删除
        </div>
      </div>
    </div>
  </div>

  <DeleteDialog
    v-if="showDeleteDialog"
    :visible="showDeleteDialog"
    :conversation-id="conversationId"
    :on-close="() => (showDeleteDialog = false)"
  />
</template>

<style scoped lang="scss">
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dialog-content {
  position: fixed;
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
}

.dialog-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a2a2a;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  &.delete {
    color: #ff4d4f;

    &:hover {
      background-color: rgba(255, 77, 79, 0.1);
    }
  }
}

.confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1f1f1f;
  border-radius: 8px;
  padding: 24px;
  width: 400px;
  z-index: 1001;

  .confirm-content {
    margin-bottom: 24px;
  }

  .confirm-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    button {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;

      &.cancel {
        background-color: #2a2a2a;
        color: #fff;

        &:hover {
          background-color: #3a3a3a;
        }
      }

      &.confirm {
        background-color: #ff4d4f;
        color: #fff;

        &:hover {
          background-color: #ff6b6b;
        }
      }
    }
  }
}
</style>
