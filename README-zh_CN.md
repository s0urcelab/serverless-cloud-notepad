# ☁ Serverless Cloud Notepad 云笔记（无服务）

[![cloudflare workers](https://badgen.net/badge/a/Cloudflare%20Workers/orange?icon=https%3A%2F%2Fworkers.cloudflare.com%2Fresources%2Flogo%2Flogo.svg&label=)](https://workers.cloudflare.com/)
![example workflow](https://github.com/s0urcelab/serverless-cloud-notepad/actions/workflows/deploy.yml/badge.svg)
[![jsdelivr](https://img.shields.io/badge/jsdelivr-cdn-brightgreen)](https://www.jsdelivr.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dotzero/pad/blob/master/LICENSE)

[English](./README.md) | 简体中文

你可以记录文字，与朋友们分享，或者跨设备同步。

基于 Cloudflare Worker、KV 和 Github Actions 实现，一键实现私有化部署。

## ✨ 功能

- ✏ 无需登录/注册, 即刻开始书写
- 💾 自动保存
- ❌ 无需服务端或数据库
- ⚡ 高可用性、高性能（只要CF不倒闭🤣）
- 📦 一键部署你自己的私有化版本（如果你有自己的域名）
- 🌍 支持中文pathname

## 🔨 使用

- 直接访问 `/` 会新建一篇随机名字的笔记

- 访问 `/随便什么` 查看/编辑指定名称的笔记

现在就试试！ [https://note.src.moe/example](https://note.src.moe/example)

> [!NOTE]
> 根据 Cloudflare [免费政策](https://developers.cloudflare.com/kv/platform/limits/)，KV每天拥有 1,000 次写入/删除额度，建议自己搭建

## 💻 兼容性

- 任何现代浏览器 (移动端可用)

## 📦 私有化部署

- 去 [这里](https://dash.cloudflare.com/profile/api-tokens) 申请你的 Cloudflare API令牌，选择 `编辑 Cloudflare Workers` 模板创建即可（~~一起白嫖到CF倒闭~~）
- Fork 本项目，然后到设置 `Settings -> Secrets and variables -> Actions` 里添加如下3个Secret:
```bash
CLOUDFLARE_API_TOKEN # 之前申请到的 Cloudflare API令牌

SCN_SALT # 随便填（安全用途）

SCN_SECRET # 随便填（安全用途）
```
- 切换到 Actions 栏, 选中左边的 `Deploy cloud-notepad` 工作流，点一下执行
- 稍等一会，执行完成后下方 Annotations 里会显示部署成功的地址
> [!WARNING]
> 由于中国大陆地区屏蔽了.workers.dev域名，请自备域名，CNAME指向上面的地址即可无痛使用

## 👀 未来规划（完结撒花🎉）

- [x] ~~密码保护功能~~
- [x] ~~支持URL链接和图片（Markdown模式）~~
- [x] ~~只读模式（分享功能）~~
- [x] ~~显示上次修改时间~~

## ☕ 捐赠

请我喝奶茶？
[https://src.moe/donate](https://src.moe/donate)
