
import Base from './base'
import Host from '@/utils/host'
const Get = async (url, params) => await Base.sendRequest(`${Host.url}/${url}`, 'GET', params)
const Put = async (url, params) => await Base.sendRequest(`${Host.url}/${url}`, 'PUT', params)
const Post = async (url, params) => await Base.sendRequest(`${Host.url}/${url}`, 'POST', params)
const Destroy = async (url, params) => await Base.sendRequest(`${Host.url}/${url}`, 'DELETE', params)
const Upload = async (filePath, params = {}) => await Base.wxUpload(`${Host.url}/upload`, filePath, params)

const GetBasic = (url, params, callback) => Base.sendRequest(`${Host.url}/${url}`, 'GET', params, callback)
const PostBasic = (url, params, callback) => Base.sendRequest(`${Host.url}/${url}`, 'POST', params, callback)

const WX = (url, params, callback) => {
  wx.request({
    url: `${Host.host}/${url}`,
    success: (data) => callback(data)
  })
}
export default {
  Get,
  Put,
  Post,
  Destroy,
  PostBasic,
  GetBasic,
  WX,
  Upload
}
