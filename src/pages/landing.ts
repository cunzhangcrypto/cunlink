// Copyright 2026 Web3村长
// SPDX-License-Identifier: Apache-2.0

import { GOOGLE_FONTS_HREF, standaloneBaseStyles } from "../styles";

export function landingResponse(): Response {
  return new Response(landingHtml(), {
    status: 200,
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "private, no-cache, must-revalidate",
    },
  });
}

function landingHtml(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cunlink - 短链接服务</title>
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="48x48" href="/icon-48.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${GOOGLE_FONTS_HREF}" rel="stylesheet">
  <style>${standaloneBaseStyles}
    html, body {
      height: 100%;
    }
    body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
      font-family: var(--font-family-display);
    }

    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
      padding: 2rem;
    }

    .logotype {
      height: clamp(3.5rem, 14vw, 8rem);
      display: block;
      user-select: none;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: clamp(1.1rem, 3.5vw, 1.6rem);
      font-weight: 600;
      color: var(--color-text-muted);
      letter-spacing: 0.15em;
    }

    .tagline {
      font-family: var(--font-family-body);
      font-size: clamp(0.95rem, 2.5vw, 1.15rem);
      color: var(--color-text-subtle);
      max-width: 32ch;
      line-height: 1.7;
      margin-top: 0.25rem;
    }

    .login-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      margin-top: 1.5rem;
      padding: 0.85rem 2.5rem;
      background: var(--color-accent);
      color: var(--color-accent-foreground);
      font-family: var(--font-family-body);
      font-size: 1.1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: var(--radius-lg);
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 4px 14px rgba(26, 107, 60, 0.25);
    }
    .login-btn:hover {
      background: var(--color-accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(26, 107, 60, 0.35);
    }
    .login-btn:active {
      transform: translateY(0);
    }
    .login-btn .icon {
      font-size: 22px;
    }

    .footer {
      position: fixed;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.4;
      transition: opacity 0.2s;
    }
    .footer:hover {
      opacity: 0.7;
    }
    .footer a {
      color: var(--color-text-muted);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .footer a .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 1.1rem;
    }
    .footer-copy {
      font-family: var(--font-family-body);
      font-size: 0.75rem;
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    @media (max-width: 480px) {
      .hero {
        gap: 1rem;
        padding: 1.5rem;
      }
      .login-btn {
        padding: 0.75rem 2rem;
        font-size: 1rem;
      }
    }
  </style>
</head>
<body>
  <div class="hero">
    <img class="logotype" src="/logotype-white.svg" alt="Cunlink" />
    <div class="subtitle">短链接 · 简单管理</div>
    <div class="tagline">将冗长的网址一键缩短，实时追踪点击数据<br/>安全、快速、完全掌控</div>
    <a class="login-btn" href="/_/admin/dashboard">
      <span class="icon">login</span> 进入管理后台
    </a>
  </div>
  <footer class="footer">
    <a href="https://cunzhangblog.com" target="_blank" rel="noopener" title="Web3村长">
      <span class="icon">Web3村长</span> 博客
    </a>
    <span class="footer-copy">&copy; ${new Date().getFullYear()} Cunlink.</span>
  </footer>
</body>
</html>`;
}
