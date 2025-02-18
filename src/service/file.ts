import { client } from './client.ts'

// 上传文件
async function uploadFile(file: File) {
  const result = await client.files.upload({ file })
  return result
}

export { uploadFile }
