import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { apiKey, baseURL } from './client'

// 定义文件对象类型
export interface CozeFile {
  id: string
  bytes: number
  created_at: number
  file_name: string
}

// 定义API响应类型
interface UploadResponse {
  code: number
  msg: string
  data: CozeFile
}

/**
 * 上传文件到Coze平台
 * @param file 要上传的File对象
 * @returns 包含文件信息的Promise
 */
//文件添加文件验证代码
const MAX_FILE_SIZE = 512 * 1024 * 1024 // 512MB
const ALLOWED_TYPES = [
  /* 具体类型列表 */
  // 文档类型
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/pdf',
  'text/csv',
  // 图片类型
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/bmp',
  // 音频类型
  'audio/wav',
  'audio/ogg',
]
export const uploadFile = async (file: File): Promise<CozeFile> => {
  // 前置验证
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`文件大小超过限制（最大${MAX_FILE_SIZE / 1024 / 1024}MB）`)
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('不支持的文件类型')
  }

  // 后续API调用逻辑
  const formData = new FormData()
  formData.append('file', file)
  try {
    const response: AxiosResponse<UploadResponse> = await axios.post(
      `${baseURL}/v1/files/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    if (response.data.code !== 0) {
      throw new Error(`文件上传失败: ${response.data.msg}`)
    }

    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`请求失败: ${error.message}`)
    }
    throw error
  }
}

/**
 * 批量上传多个文件
 * @param files 要上传的File列表
 * @returns 包含所有文件信息的Promise
 */
export const uploadFiles = async (files: File[]): Promise<CozeFile[]> => {
  return Promise.all(files.map((file) => uploadFile(file)))
}
