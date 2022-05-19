# ☁ Serverless Cloud Notepad 云笔记（无服务版）

[![cloudflare workers](https://badgen.net/badge/a/Cloudflare%20Workers/orange?icon=https%3A%2F%2Fworkers.cloudflare.com%2Fresources%2Flogo%2Flogo.svg&label=)](https://workers.cloudflare.com/)
[![jsdelivr](https://img.shields.io/badge/jsdelivr-cdn-brightgreen)](https://www.jsdelivr.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dotzero/pad/blob/master/LICENSE)

[English](./README.md) | 简体中文

你可以记录文字，与朋友们分享，或者跨设备同步。

基于 Cloudflare Worker 实现，轻松实现私有化部署。

## ✨ 功能

- ✏ 无需登录/注册, 即刻开始书写
- 💾 自动保存
- ❌ 无需服务端或数据库
- ⚡ 高可用性、高性能（只要CF不倒闭🤣）
- 📦 轻松部署私有化版本（如果你有自己的域名）
- 🌍 支持中文pathname

## 🔨 使用

- 直接访问 `/` 会新建一篇随机名字的笔记

- 访问 `/随便什么` 查看/编辑指定名称的笔记

现在就试试！ [https://note.src.moe/example](https://note.src.moe/example)

## 💻 兼容性

- 任何现代浏览器 (移动端可用)

## 📦 私有化部署

- 申请创建你自己的Work和KV（免费版就好~~一起白嫖到CF倒闭~~） [workers.cloudflare.com](https://workers.cloudflare.com/).
- 下载仓库代码，编辑 `wrangler.toml`:
```
kv_namespaces = [
  { binding = "NOTES", id = "<这里填你自己的第1个KV id>" },
  { binding = "SHARE", id = "<这里填你自己的第2个KV id>" }
]
```
- 执行命令推送代码到 Cloudflare
```
$ npm i
$ npm run publish
```
- 给你的域名添加一条CNAME解析记录，指向你刚刚创建的Work地址（如果你有自己的域名的话）

## 👀 未来规划（完结撒花🎉）

- [x] 密码保护功能
- [x] 支持URL链接和图片（Markdown模式）
- [x] 只读模式（分享功能）
- [x] 显示上次修改时间

## ☕ 捐赠

请我喝奶茶？
  
[https://src.moe/donate](https://src.moe/donate)
