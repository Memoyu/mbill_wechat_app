const TransformPages = require('uni-read-pages')
const tfPages = new TransformPages({
	includes: ['path', 'name', 'meta', 'title'] //需要获取包涵的字段
})
module.exports = {
	configureWebpack: {
		plugins: [
			new tfPages.webpack.DefinePlugin({
				ROUTES: JSON.stringify(tfPages.routes)
			})
		],
	},
}
