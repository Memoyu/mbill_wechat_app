const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

module.exports = {
    transpileDependencies: ['@dcloudio/uni-ui', 'luch-request', 'uni-simple-router'],
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'meta', 'aliasPath']
                    });
                    return JSON.stringify(tfPages.routes)
                }, true)
            })
        ]
    }
}