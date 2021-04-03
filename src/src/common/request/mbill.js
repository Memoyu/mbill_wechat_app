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
		info: {
			url: 'user/get',
			auth: true,
			method: 'GET',
			// desc: '获取账户信息',
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
			url: 'statement/create',
			auth: true,
			method: 'POST',
			// desc: '创建账单',
		},
		update: {
			url: 'statement/update',
			auth: true,
			method: 'PUT',
			// desc: '更新账单',
		},
		delete: {
			url: 'statement/delete',
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
	},

};