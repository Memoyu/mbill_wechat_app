/**
 * 接口列表
 */
export default {
    /** 分类 */
	category: {
		list: {
			url: 'category/groups',
			auth: true,
			method: 'GET',
			// desc: '分类类别',
		},
		detail: {
			url: 'category/get',
			auth: true,
			method: 'GET',
			// desc: '分类详情',
		},
	},
    /** 账单 */
    statement: {
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
	},
};