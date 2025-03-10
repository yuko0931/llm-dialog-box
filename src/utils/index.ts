import type { uploadFileItem } from '@/types/index'
// 定义 contentList 中每个项的类型（不全，应该够用
interface ContentItem {
  type: 'text' | 'file'
  text?: string
  file_id?: string
  name?: string
  size?: number
}

// 文件大小格式化工具函数
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const isImageFile = (fileName: string) => {
  // 定义图片类型后缀列表（用户提供的列表中图片类型）
  const imageExtensions = ['jpg', 'png', 'gif', 'webp', 'bmp', 'pcd', 'tiff']
  // 获取文件名后缀（统一转小写）
  const extension = fileName?.toLowerCase()?.split('.')?.pop() || ''
  // 检查后缀是否在图片类型列表中
  return imageExtensions.includes(extension)
}

export const returnContent2Files = (contentList: ContentItem[]) => {
  let content = ''
  const files: uploadFileItem[] = []
  contentList.forEach((item) => {
    if (item.type === 'text') {
      content += item.text
    } else {
      files.push({
        id: item.file_id as string,
        name: item.name as string,
        size: formatFileSize(item.size as number),
      })
    }
  })
  return {
    role: 'user',
    content: content,
    files: files,
    content_type: 'object_string',
  }
}
