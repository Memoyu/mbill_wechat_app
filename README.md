<h1  align="center">
    <a href="http://memoyu.cn/">
        <img width="100" height="100" src="https://github.com/Memoyu/Memoyu.Core/blob/master/doc/images/memoyu.png">
    </a>
    </br>
    </br>
     <span  align="center">
 	 	个人记账小程序
     </span>
</h1>
<div align="center">

> 知行合一

[![小程序: uni-app](https://img.shields.io/badge/小程序-uni--app-blue)](https://github.com/dcloudio/uni-app)&ensp;[![](https://img.shields.io/badge/license-MIT-3963bc.svg)](LICENSE)
</div>


&nbsp;

## 项目介绍

项目为个人记账微信小程序端实现。

【基于WePY 2.x项目在分支中可见】

界面参考设计：[yigger/jiezhang: 基于 wepy 开发的一款纯记账的微信小程序 ](https://github.com/yigger/jiezhang)

&nbsp;

## 相关项目

✨[采用.NET5实现的后端服务 - Memoyu/mbill_service](https://github.com/Memoyu/mbill_service)

✨[采用Blazor+Ant Blazor实现后端管理 - Memoyu/mbill_blazor_admin](https://github.com/Memoyu/mbill_blazor_admin)

✨[采用Xamarin搭建移动客户端App-Memoyu/mbill_xamarin_app](https://github.com/Memoyu/mbill_xamarin_app)

&nbsp;

## TODO

- [x] 搭建基本界面
- [x] 实现接口调用
- [x] 实现天气展示（基于高德WX SDK开发）
- [x] 实现统计效果显示
- [ ] 优化界面设计
- [ ] ......

&nbsp;

## 效果演示

![mbill_wechat_app/doc at main · Memoyu/mbill_wechat_app (github.com)](https://github.com/Memoyu/mbill_wechat_app/blob/main/doc/效果图.png)

&nbsp;

## TimeLine

`2021-01-25：`突然发现自己用的是wepy1.6版本，目前正在突突上2.x

`2021-01-31：`基本完成WePY 2.x的升级，剩下对基于ECharts的报表实现。

`2021-02-01：`完成对ECharts的集成，踩了一天的坑，主要是没有完整的教程，走了很多弯路，导致半天做了无用功。目前仍存在问题：legend无法点击、点击无高亮，很诡异。有空写一下详细教程吧，目前的For weixin ECharts 很容易集成的。

`2021-02-02：`莫名其妙破案，明天整理一下教程！[WePY 2.x 下使用ECharts - Memoyu - 博客园 (cnblogs.com)](https://www.cnblogs.com/memoyu/p/14360278.html)

`2021-03-01：`打算转战uni-app了。wepy现在直接没人更新了，太难了，很多问题难以解决。

`2021-03-18`：基本完成向uni-app迁移。接下来继续晚上功能，并且将大部分时间去完善一下blazor后台管理。

`2021-03-29`：完成对uni-app下ECharts的配置与使用，与WePY配置类似[uni-app 下使用ECharts - Memoyu - 博客园 (cnblogs.com)](https://www.cnblogs.com/memoyu/p/14555331.html)

`2021-04-17`：完成小程序发版与迭代到1.0.3版本，基本可日常使用，暂时停止更新，完成Blog或Blazor 后端管理

`2021-10-18`：搁置很久了，昨天算是再更新了一个版本，这次是在“领导的”压力下才更新的微信登陆，看到过往的代码，一个感叹啊，一堆屎山。往后接着更新吧，前期真的步子迈的太大了，目前是后端管理/小程序/后台服务都给干上了，但是也是做着做着就是去了激情，也就没动力了。。。。。

&nbsp;

## 开源协议

[MIT](LICENSE).
