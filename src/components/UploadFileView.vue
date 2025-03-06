<template>
  <div class="file-item" @mouseenter="isHoverd = true" @mouseleave="isHoverd = false">
    <div class="file-view">
      <div class="parsing-spinner" v-if="!isparsing">
        <svg
          viewBox="0 0 36 36"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          data-icon="spin"
        >
          <defs>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="100%" id="linearGradient-1">
              <stop stop-color="currentColor" stop-opacity="0" offset="0%"></stop>
              <stop stop-color="currentColor" stop-opacity="0.50" offset="39.9430698%"></stop>
              <stop stop-color="currentColor" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <rect fill-opacity="0.01" fill="none" x="0" y="0" width="36" height="36"></rect>
            <path
              d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951"
              stroke="url(#linearGradient-1)"
              stroke-width="4"
              stroke-linecap="round"
            ></path>
          </g>
        </svg>
      </div>
      <img :src="filepath" alt="file" v-else />
    </div>
    <div class="file-detail">
      <div class="file-name">{{ props.name }}</div>
      <div class="file-size" v-if="isparsing">{{ props.size }}</div>
      <div class="file-size" v-else>解析中...</div>
      <div class="file-delete" v-show="isHoverd" @click="handleDeleteFile">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.45.549a.777.777 0 0 1 0 1.098L1.648 7.451A.776.776 0 1 1 .55 6.353L6.353.55a.776.776 0 0 1 1.098 0z"
            fill="#868686"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M.55.548a.776.776 0 0 1 1.097 0l5.804 5.805A.777.777 0 0 1 6.353 7.45L.549 1.646a.777.777 0 0 1 0-1.098z"
            fill="#868686"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isHoverd = ref<boolean>(false)

// 根据文件名后缀判断是否为图片
const filepath = computed(() => {
  const basepath = '/llm-dialog-box/img/'
  const imageExtensions = ['jpg', 'png', 'gif', 'webp', 'bmp', 'pcd', 'tiff']
  // 获取文件名后缀（统一转小写
  const extension = props.name?.toLowerCase()?.split('.')?.pop() || ''
  const filetype = imageExtensions.includes(extension) ? 'img' : 'file'
  return basepath + filetype + '.svg'
})

// 接收父组件传递的参数
const props = defineProps({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  size: {
    type: String,
  },
  isparsing: {
    type: Boolean,
  },
})
// 父组件触发事件
const emit = defineEmits(['delete-file'])

// 删除文件
const handleDeleteFile = () => {
  // 触发父组件事件
  emit('delete-file', props.name)
}
</script>

<style lang="scss" scoped>
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

    .parsing-spinner {
      box-sizing: border-box;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;

      svg {
        color: #c9c9c9;
      }
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }
  }

  .file-detail {
    position: relative;
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

    .file-delete {
      position: absolute;
      top: -9px;
      right: -1px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;

      &:hover {
        background-color: #bbb;
      }
    }
  }
}
</style>
