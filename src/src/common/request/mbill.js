/**
 * 接口列表
 */
export default {
	/** 用户 */
	user: {
		login: {
			url: 'account/login',
			auth: false,
			method: 'POST',
			// desc: '账户登录',
		},
		wxlogin: {
			url: 'account/wxlogin',
			auth: false,
			method: 'POST',
			// desc: '微信登录',
		},
		info: {
			url: 'account/user',
			auth: true,
			method: 'GET',
			// desc: '获取账户信息',
		},
	},
	wx: {
		code2session: {
			url: 'wx/getcode2session',
			auth: false,
			method: 'GET',
			// desc: 'code2session',
		},
		wxlogin: {
			url: 'wx/wxlogin',
			auth: false,
			method: 'GET',
			// desc: '微信登录',
		},
	},

	/** 资产分类 */
	asset: {
		group: {
			url: 'asset/groups',
			auth: true,
			method: 'GET',
			// desc: '资产分类类别',
		},
		detail: {
			url: 'asset/get',
			auth: true,
			method: 'GET',
			// desc: '资产分类详情',
		},
	},
	/** 账单分类 */
	category: {
		group: {
			url: 'category/groups',
			auth: true,
			method: 'GET',
			// desc: '账单分类类别',
		},
		detail: {
			url: 'category/get',
			auth: true,
			method: 'GET',
			// desc: '账单分类详情',
		},
	},

	/** 账单 */
	statement: {
		create: {
			url: 'statement',
			auth: true,
			method: 'POST',
			// desc: '创建账单',
		},
		update: {
			url: 'statement',
			auth: true,
			method: 'PUT',
			// desc: '更新账单',
		},
		delete: {
			url: 'statement',
			auth: true,
			method: 'DELETE',
			// desc: '删除账单',
		},
		list: {
			url: 'statement/pages',
			auth: true,
			method: 'GET',
			// desc: '账单分页数据',
		},
		detail: {
			url: 'statement/detail',
			auth: true,
			method: 'GET',
			// desc: '账单详情',
		},
		total: {
			url: 'statement/statistics/total',
			auth: true,
			method: 'GET',
			// desc: '账单月各类型账单金额统计',
		},
		expendCategory: {
			url: 'statement/statistics/expend/category',
			auth: true,
			method: 'GET',
			// desc: '支出分类统计',
		},
		expendTrendWeek: {
			url: 'statement/statistics/expend/trend/week',
			auth: true,
			method: 'GET',
			// desc: '前月份所有周的支出趋势统计',
		},
		expendTrend5Month: {
			url: 'statement/statistics/expend/trend/5month',
			auth: true,
			method: 'GET',
			// desc: '5个月的支出趋势统计',
		},
	},

};