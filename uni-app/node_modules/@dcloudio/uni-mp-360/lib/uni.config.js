const path = require('path')

const parseAppJson = require('./parser/app-json-parser')

const css = '#seapp-custom-action-sheet{bottom: var(--window-bottom) !important;}'

module.exports = {
  configureEnv () {
    process.env.UNI_OUTPUT_DIR = path.join(process.env.UNI_OUTPUT_DIR, 'dist')
  },
  configureH5 (h5Options) {
    h5Options.router.mode = 'hash'
    h5Options.router.base = h5Options.publicPath = '/'
  },
  configurePages (pagesJson, manifestJson, loader) {
    loader.emitFile('app.json', JSON.stringify(parseAppJson(pagesJson, manifestJson), null, 2))
  },
  copyWebpackOptions (platformOptions, vueOptions, copyOptions) {
    if (copyOptions) {
      const copyOption = copyOptions.find(copyOption => copyOption.from.indexOf('index.css') !== -1)
      if (copyOption) {
        copyOption.to = 'app.css'
        copyOption.transform = function (content) {
          return content + css
        }
      }
    }
  },
  configureWebpack (config) {
    return {
      output: {
        filename: (chunkData) => {
          return chunkData.chunk.name === 'index' ? 'app.js' : 'static/js/[name].js'
        }
      },
      resolve: {
        alias: {
          'uni-h5': path.resolve(__dirname, '../dist/index.umd.min.js')
        }
      },
      optimization: {
        splitChunks: {
          cacheGroups: {
            vendors: false,
            common: false
          }
        }
      }
    }
  },
  chainWebpack (config) {
    config.plugins.delete('html-index')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  }
}
