import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
  const isRegenerate = ref<boolean>(false) // 是否重新生成llm answer

  return { isRegenerate }
})
