
// 0 开发环境 1 测试环境 2 生产环境
const env = 0

let host = ''

module.exports = {
  host: host,
  url: host + '/api',
  login: host + '/api/login',
  check_openid: host + '/api/check_openid',
  env: env,
  mapKey: 'Z26BZ-SYOWD-63A4O-HK3CL-W5BIQ-RMFWX',
  appid: 'wxfa7ea00af7a49db7'
}
