# ☁ Serverless Cloud Notepad

[![cloudflare workers](https://badgen.net/badge/a/Cloudflare%20Workers/orange?icon=https%3A%2F%2Fworkers.cloudflare.com%2Fresources%2Flogo%2Flogo.svg&label=)](https://workers.cloudflare.com/)
[![jsdelivr](https://img.shields.io/badge/jsdelivr-cdn-brightgreen)](https://www.jsdelivr.com/)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/dotzero/pad/blob/master/LICENSE)

English | [简体中文](./README-zh_CN.md)

Build for recording text or sharing between friends.

Powerby Cloudflare Workers, easy to deploy privately.

## ✨ Features

- ✏ No login/register required, start writing right away.
- 💾 Auto saving.
- ❌ No backend/server or database required.
- ⚡ High available & High performance in worldwide.
- 📦 Easy to deploy in your own site.
- 🌍 i18n support for pathname.

## 🔨 Usage

- Enter `/` root path will generate a new note with random path.

- Enter `/any-custom-name-you-like` view/edit custom note.

Try it out! [https://note.src.moe/example](https://note.src.moe/example)

## 💻 Compatibility

- Modern browsers (both PC & Mobile)

## 📦 Deployment

- sign up your own Worker/KV in [workers.cloudflare.com](https://workers.cloudflare.com/).
- clone repo & edit `wrangler.toml`:
```
kv_namespaces = [
  { binding = "NOTES", id = "<your first KV id here>" },
  { binding = "SHARE", id = "<your second KV id here>" }
]
```
- push code to Cloudflare with wrangler CLI
```
$ npm i
$ npm run publish
```
- CNAME Worker url to your domain.

## 👀 Roadmap

- [x] password protection.
- [x] support URL/Image (Markdown mode).
- [x] read only mode (share link).
- [x] show last modify date.
