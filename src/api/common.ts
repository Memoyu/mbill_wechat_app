import type { IQiniuUploadToken } from './types/common'
import { http } from '@/utils/http'

/**
 * 获取七牛上传凭证
 */
export function createQiniuToken(path: string) {
  return http.get<IQiniuUploadToken>('filestorage/qiniu/upload/token', { path })
}

export function uploadAvatar(userId: string, avatarUrl: string) {
  const ext = getImageExt(avatarUrl)
  // 头像使用id作为文件名，覆盖原文件，需要增加timestamp避免缓存
  return uploadImage(`user/avatar/${userId}.${ext}`, avatarUrl, true)
}

/**
 * 上传图片
 * @param targetPath 上传目标路径
 * @param tempPath 临时图片路径
 * @param hasTime 是否添加时间戳参数，避免缓存
 */
function uploadImage(targetPath: string, tempPath: string, hasTime: boolean = false) {
  return new Promise<string>((resolve, reject) => {
    createQiniuToken(targetPath).then((tokenRes) => {
      console.log('token res', tokenRes)
      if (!tokenRes || !tokenRes.token || tokenRes.token.length < 1)
        reject(new Error('获取七牛云上传凭证失败'))
      const token = tokenRes.token
      const host = tokenRes.host
      uni.uploadFile({
        url: 'https://up-z2.qiniup.com',
        filePath: tempPath,
        fileType: 'image',
        name: 'file',
        formData: {
          key: targetPath,
          token,
        },
        header: {
          'Content-Type': 'multipart/form-data',
        },
        success: (res) => {
          if (res.statusCode !== 200) {
            const data = JSON.parse(res.data) as any
            reject(new Error(`上回传七牛云失败：${data.error}`))
          }
          else {
            console.log(`${host}${targetPath}`)
            resolve(`${host}${targetPath}${hasTime ? `?t=${Date.now()}` : ''}`)
          }
        },
        fail: (err) => {
          console.log('err', err)
          reject(new Error(`上传图片失败`))
        },
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

function getImageExt(url: string): string {
  // 处理各种 URL 格式
  try {
    // 移除查询参数部分
    const cleanUrl = url.split('?')[0]
    // 获取最后一个 . 后的部分
    const parts = cleanUrl.split('.')
    if (parts.length > 1) {
      const extension = parts[parts.length - 1].toLowerCase()
      // 验证是否为常见的图片扩展名
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
      if (validExtensions.includes(extension)) {
        return extension
      }
    }
  }
  catch (error) {
    console.warn('无法解析文件扩展名:', error)
  }
  return 'jpg' // 如果无法解析则返回jpg
}
