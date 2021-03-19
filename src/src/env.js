const ENV_BASE_URL = {
	development: 'http://39.108.97.141:5901',//'http://localhost:5000',//'http://http://39.108.97.141:5901', //开发环境
	production: 'http://39.108.97.141:5901', //生产环境
}

const ENV_API_URL = {
	development: `${ENV_BASE_URL.development}/api/`, //开发环境
	production: `${ENV_BASE_URL.production}/api/`, //生产环境
}

export const BASE_URL = ENV_BASE_URL[process.env.NODE_ENV || 'development']; //域名
export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名
export const MAP_KEY = 'Z26BZ-SYOWD-63A4O-HK3CL-W5BIQ-RMFWX'; //腾讯地图Key
export const AMAP_KEY = '24bd397816f5e71366ffc9a848e41389'; //高德地图Key
export const APP_ID = 'wxfa7ea00af7a49db7'; //appId