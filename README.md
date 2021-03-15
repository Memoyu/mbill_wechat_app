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

[![小程序: wepy (shields.io)](https://img.shields.io/badge/小程序-wepy-blue)](https://github.com/Tencent/wepy)&ensp;[![](https://img.shields.io/badge/license-MIT-3963bc.svg)](LICENSE)
</div>


&nbsp;

## 项目介绍

<font size=4  color=red>**此分支为基于WePY 2.x 实现，已废弃，但是基本界面已完成搭建以及ECharts已接入**</font>

项目为个人记账小程序端实现。

参考设计：[yigger/jiezhang: 基于 wepy 开发的一款纯记账的微信小程序 ](https://github.com/yigger/jiezhang)

&nbsp;

## 相关项目

✨[采用.NET5实现的后端服务 - Memoyu/mbill_service](https://github.com/Memoyu/mbill_service)

✨[采用Blazor+Ant Blazor实现后端管理 - Memoyu/mbill_blazor_admin](https://github.com/Memoyu/mbill_blazor_admin)

✨[采用Xamarin搭建移动客户端App-Memoyu/mbill_xamarin_app](https://github.com/Memoyu/mbill_xamarin_app)

&nbsp;

## TODO

- [x] 搭建基本界面

  &nbsp;

## 效果演示

![effect](https://github.com/Memoyu/mbill_wechat_app/blob/WePY2.x/doc/images/effect.png)

## TimeLine

`2021-01-25：`突然发现自己用的是wepy1.6版本，目前正在突突上2.x

`2021-01-31：`基本完成WePY 2.x的升级，剩下对基于ECharts的报表实现。

`2021-02-01：`完成对ECharts的集成，踩了一天的坑，主要是没有完整的教程，走了很多弯路，导致半天做了无用功。目前仍存在问题：legend无法点击、点击无高亮，很诡异。有空写一下详细教程吧，目前的For weixin ECharts 很容易集成的。

`2021-02-02：`莫名其妙破案，明天整理一下教程！[WePY 2.x 下使用ECharts - Memoyu - 博客园 (cnblogs.com)](https://www.cnblogs.com/memoyu/p/14360278.html)

`2021-03-01：`打算转战uni-app了。wepy现在直接没人更新了，太难了，很多问题难以解决。

&nbsp;

## 开源协议

[MIT](LICENSE).