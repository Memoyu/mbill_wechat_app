# uni-mp-360

适配360小程序的uni插件项目

1. clone 本插件工程至本地

2. 创建uni-app工程
```
# 全局安装vue-cli
npm install -g @vue/cli
# 创建uni-app项目，会提示选择项目模板，可选择 hello uni-app 模板
vue create -p dcloudio/uni-preset-vue#alpha my-project
```

3. 在`my-project`项目中安装本地依赖`uni-mp-360`(步骤一中clone下来的插件根目录)，如：
```
yarn add /Users/user/Documents/uni-mp-360
```

4. 在`my-project` 根目录 `package.json` 的 `scripts` 节点中增加以下脚本命令：
```
"dev:mp-360": "cross-env NODE_ENV=development UNI_PLATFORM=mp-360 vue-cli-service uni-build --watch",
"build:mp-360": "cross-env NODE_ENV=production UNI_PLATFORM=mp-360 vue-cli-service uni-build"
```
5. 编译360小程序
```
# dev 模式，编译预览
npm run dev:mp-360
# build 模式，发行打包
npm build:mp-360
```
6. 将编译后的`dist/(dev|build)/mp-360/`目录导入360安全浏览器
