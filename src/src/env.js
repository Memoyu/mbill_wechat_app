const ENV_BASE_URL = {
	development: 'http://39.108.97.141:5901', //开发环境
	production: 'http://', //生产环境
}

const ENV_API_URL = {
	development: `${ENV_BASE_URL.development}/api/`, //开发环境
	production: `${ENV_BASE_URL.production}/api/`, //生产环境
}

export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名
export const MAP_KEY = 'Z26BZ-SYOWD-63A4O-HK3CL-W5BIQ-RMFWX'; //腾讯地图Key
export const APP_ID = 'wxfa7ea00af7a49db7'; //appId