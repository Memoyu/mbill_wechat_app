const ENV_BASE_URL = {
	development: 'http://localhost:5000', //开发环境
	production: 'http://', //生产环境
}

const ENV_API_URL = {
	development: `${ENV_BASE_URL.development}/api/`, //开发环境
	production: `${ENV_BASE_URL.production}/api/`, //生产环境
}

export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名