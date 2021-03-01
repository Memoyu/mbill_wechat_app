
import Base from './base'
import Host from '@/utils/host'
const Get = async (url, data, isShowLoading = true) => await Base.sendRequest(`${Host.url}/${url}`, 'GET', data, isShowLoading)
const Put = async (url, data, isShowLoading = true) => await Base.sendRequest(`${Host.url}/${url}`, 'PUT', data, isShowLoading)
const Post = async (url, data, isShowLoading = true) => await Base.sendRequest(`${Host.url}/${url}`, 'POST', data, isShowLoading)
const Delete = async (url, data, isShowLoading = true) => await Base.sendRequest(`${Host.url}/${url}`, 'DELETE', data, isShowLoading)
const Upload = async (filePath, data = {}, isShowLoading = true) => await Base.wxUpload(`${Host.url}/upload`, filePath, data, isShowLoading)

const GetBasic = (url, data, isShowLoading = true) => Base.sendRequest(`${Host.url}/${url}`, 'GET', data, isShowLoading)
const PostBasic = (url, data, isShowLoading = true) => Base.sendRequest(`${Host.url}/${url}`, 'POST', data, isShowLoading)

export default {
  Get,
  Put,
  Post,
  Delete,
  PostBasic,
  GetBasic,
  Upload
}
