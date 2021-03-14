import { API_URL } from '@/env'

export default class Request {
    config = {
		baseUrl: API_URL,
		header: {
			'content-type': 'application/json',
		},
		method: 'GET',
		dataType: 'json',
		// #ifndef MP-ALIPAY || APP-PLUS
		responseType: 'text',
		// #endif
		custom: {},
		// #ifdef MP-ALIPAY
		timeout: 30000,
		// #endif
		// #ifdef APP-PLUS
		sslVerify: false
		// #endif
	}

    static posUrl(url) { /* 判断url是否为绝对路径 */
		return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
	}

    /**
     * 拼接请求参数
     * @param {Array} params - 请求参数
     * @returns 
     */
    static addQueryString(params) {
		let paramsData = ''
		Object.keys(params).forEach(function(key) {
			paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
		})
		return paramsData.substring(0, paramsData.length - 1)
	}

    /**
	 * @property {Function} request 请求拦截器
	 * @property {Function} response 响应拦截器
	 * @type {{request: Request.interceptor.request, response: Request.interceptor.response}}
	 */
	interceptor = {
		/**
		 * @param {Request~requestCallback} cb - 请求之前拦截,接收一个函数（config, cancel）=> {return config}。第一个参数为全局config,第二个参数为函数，调用则取消本次请求。
		 */
		request: (cb) => {
			if (cb) {
				this.requestBeforeFun = cb
			}
		},
		/**
		 * @param {Request~responseCallback} cb 响应拦截器，对响应数据做点什么
		 * @param {Request~responseErrCallback} ecb 响应拦截器，对响应错误做点什么
		 */
		response: (cb, ecb) => {
			if (cb && ecb) {
				this.requestComFun = cb
				this.requestComFail = ecb
			}
		}
	}

    requestBeforeFun(config) {
		return config
	}

	requestComFun(response) {
		return response
	}

	requestComFail(response) {
		return response
	}

    /**
	 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
	 * @param { Number } statusCode - 请求响应体statusCode（只读）
	 * @return { Boolean } 如果为true,则 resolve, 否则 reject
	 */
	validateStatus(statusCode) {
		return statusCode === 200
	}

    async request(options = {}) {
        options.baseUrl = this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		// #ifndef MP-ALIPAY || APP-PLUS
		options.responseType = options.responseType || this.config.responseType
		// #endif
		// #ifdef MP-ALIPAY
		options.timeout = options.timeout || this.config.timeout
		// #endif
		options.url = options.url || ''
		options.data = options.data || {}
		options.params = options.params || {}
		options.header = options.header || this.config.header
		options.method = options.method || this.config.method
		options.custom = { ...this.config.custom,
			...(options.custom || {})
		}
        // #ifdef APP-PLUS
        options.sslVerify = options.sslVerify === undefined ? this.config.sslVerify : options.sslVerify
        // #endif
        return new Promise((resolve, reject) => {
            let next = true
			let handleRe = {}

			options.complete = (response) => {
				response.config = handleRe
				if (this.validateStatus(response.statusCode)) { // 成功
					response = this.requestComFun(response)
					resolve(response.data)
				} else if (401 === response.statusCode) {
					response = this.requestComFun(response)
					resolve(response.data)
				} else if (500 === response.statusCode) {
					resolve(response.data)
				} else {
					response = this.requestComFail(response)
					reject(response)
				}
			}
			const cancel = (t = 'handle cancel', config = options) => {
				const err = {
					errMsg: t,
					config: config
				}
				reject(err)
				next = false
			}

			handleRe = { ...this.requestBeforeFun(options, cancel)
			}
			const _config = { ...handleRe
			}
			if (!next) return
			delete _config.custom
			let mergeUrl = Request.posUrl(_config.url) ? _config.url : (_config.baseUrl + _config.url)
			if (JSON.stringify(_config.params) !== '{}') {
				const paramsH = Request.addQueryString(_config.params);
				mergeUrl += mergeUrl.indexOf('?') === -1 ? `?${paramsH}` : `&${paramsH}`
			}
			_config.url = mergeUrl
			uni.request(_config) 
        })
    }

    get(url, options = {}) {
		return this.request({
			url,
			method: 'GET',
			...options
		})
	}

	post(url, data, options = {}) {
		return this.request({
			url,
			data,
			method: 'POST',
			...options
		})
	}
}