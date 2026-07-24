<p align="center">
  <img src="./public/logotype-white.svg" alt="Cunlink" height="80" />
</p>

<h3 align="center">短链接 · 简单管理</h3>

<p align="center">
  <a href="./README.en.md"><strong>English</strong></a>
</p>

---

# Cunlink

> 基于 Cloudflare Workers + D1 的个人短链接系统。
> 由 [Web3村长](https://cunzhangblog.com) 在 [shrtnr](https://github.com/oddbit/shrtnr) 基础上修改定制。

轻量、快速、完全掌控。将冗长的网址一键缩短，实时追踪点击数据。

## 功能特性

- **免费托管** 在 Cloudflare Workers + D1 上运行，无需服务器，无需月费
- **短链生成** 支持 3 位随机短码，也可使用自定义短码
- **点击分析** 追踪来源、国家、设备、浏览器等维度
- **链接分组** 将相关链接分组，统一查看组合数据
- **管理后台** 链接管理、分析图表、二维码生成
- **多语言界面** 中文 / English

## 快速部署

### 一键部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/)

### 手动部署

```bash
git clone https://github.com/cunzhang/cunlink
cd cunlink
yarn install
npx wrangler login
npx wrangler d1 create cunlink-db
npx wrangler deploy
npx wrangler d1 migrations apply DB --remote
```

### 本地开发

```bash
yarn install
npx wrangler d1 migrations apply DB --local
npx wrangler dev
```

然后访问 `http://localhost:8787` 即可查看。

### 本地开发免登录

在项目根目录创建 `.dev.vars` 文件：

```
DEV_IDENTITY=dev@local
```

然后启动 `npx wrangler dev` 即可自动以该身份登录。

## 访问控制

管理后台 (`/_/admin/*`) 默认不内置用户认证。建议使用 [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) 来保护后台。

## 致谢

Cunlink 是基于 [shrtnr](https://github.com/oddbit/shrtnr) 修改定制的衍生作品。

- **原作者**: [Oddbit](https://oddbit.id)
- **原仓库**: [github.com/oddbit/shrtnr](https://github.com/oddbit/shrtnr)
- **开源协议**: Apache License 2.0

感谢 Oddbit 团队开发并开源了 shrtnr 这个优秀的短链接系统。

## 许可证

Copyright (c) 2026 [Web3村长](https://cunzhangblog.com)

本项目为 [shrtnr](https://github.com/oddbit/shrtnr) 的衍生作品，基于 **Apache License, Version 2.0** 许可。

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

完整的许可证文本请参见 [LICENSE](./LICENSE) 文件和 [NOTICE](./NOTICE) 文件。
