const ENV_BASE_URL = {
	development: 'http://localhost:10085', //'http://39.108.97.141:5901',//'http://http://39.108.97.141:5901', //开发环境
	production: 'https://mbill.memoyu.com', //生产环境
}

const ENV_API_URL = {
	development: `${ENV_BASE_URL.development}/api/`, //开发环境
	production: `${ENV_BASE_URL.production}/api/`, //生产环境
}

export const BASE_URL = ENV_BASE_URL[process.env.NODE_ENV || 'development']; //域名
export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名