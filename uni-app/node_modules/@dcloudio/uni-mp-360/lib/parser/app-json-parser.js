const path = require('path')

const isWin = /^win/.test(process.platform)
const normalizePath = path => (isWin ? path.replace(/\\/g, '/') : path)

const removePlatformStyle = function (style) {
  const PLATFORMS = global.uniPlugin.platforms || []
  Object.keys(style).forEach(name => {
    if (PLATFORMS.includes(name)) {
      delete style[name]
    }
  })
  return style
}

function parseWindow (style = {}) {
  const windowJson = Object.create(null)
  Object.assign(windowJson, style, style['mp-360'] || {})
  return removePlatformStyle(windowJson)
}

function parsePage (page) {
  return {
    route: page.path,
    window: parseWindow(page.style)
  }
}

module.exports = function parseAppJson (pagesJson, manifestJson) {
  const pages = []
  pagesJson.pages.forEach(page => {
    pages.push(parsePage(page))
  })
  const subPackages = pagesJson.subPackages
  if (Array.isArray(subPackages)) {
    subPackages.forEach(subPackage => {
      const root = subPackage.root
      subPackage.pages.forEach(page => {
        pages.push(parsePage({
          path: normalizePath(path.join(root, page.path)),
          style: page.style
        }))
      })
    })
  }
  return Object.assign({
    sdkversion: '1.0.0'
  }, manifestJson['mp-360'] || {}, {
    pages,
    window: parseWindow(pagesJson.globalStyle)
  })
}
