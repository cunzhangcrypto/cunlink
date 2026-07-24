// Copyright 2026 Web3村长
// SPDX-License-Identifier: Apache-2.0

import type { FC } from "hono/jsx";
import type { TranslateFn } from "../i18n";
import type { TimelineRange } from "../types";
import { SUPPORTED_LANGUAGES } from "../i18n";
import { fmtNumber } from "../i18n/format";
import { RANDOM_CHARSET } from "../slugs";
import { MIN_SLUG_LENGTH } from "../constants";

const RANGE_OPTIONS: TimelineRange[] = ["24h", "7d", "30d", "90d", "1y", "all"];

type Props = {
  theme: string;
  slugLength: number;
  lang: string;
  defaultRange: TimelineRange;
  filterBots: boolean;
  filterSelfReferrers: boolean;
  t: TranslateFn;
  userEmail?: string | null;
};

export const SettingsPage: FC<Props> = ({ theme, slugLength, lang, defaultRange, filterBots, filterSelfReferrers, t, userEmail }) => {
  const combos = Math.pow(RANDOM_CHARSET.length, Math.max(slugLength, MIN_SLUG_LENGTH));
  const comboHint =
    slugLength >= 3
      ? t("settings.combos", { count: fmtNumber(combos, lang) })
      : t("settings.minLength");

  const brandLogotype = "/logotype-white.svg";

  return (
    <>
      <div class="page-header">
        <div class="page-title">{t("settings.title")}</div>
        <div class="page-subtitle">{t("settings.subtitle")}</div>
      </div>

      <div class="settings-layout">
        <div class="settings-main">
          <div class="bento-card">
            <div class="form-group">
              <label class="form-label">{t("settings.language")}</label>
              <div class="form-select">
                <select
                  class="form-input"
                  id="language-picker"
                  onchange="setLanguage(this.value)"
                >
                  {SUPPORTED_LANGUAGES.map((code) => {
                    const native = t(`lang.${code}` as any);
                    const local = t(`langLocal.${code}` as any);
                    const label = lang === code ? native : `${native} · ${local}`;
                    return (
                      <option value={code} selected={lang === code}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div class="bento-card">
            <div class="form-group">
              <label class="form-label">{t("settings.theme")}</label>
              <div class="theme-toggle" id="theme-picker">
                <button
                  class={`theme-btn${theme === "cunlink" ? " active" : ""}`}
                  data-theme="cunlink"
                  onclick="setTheme('cunlink')"
                >
                  <span class="icon">eco</span> {t("settings.themeOddbit")}
                </button>
                <button
                  class={`theme-btn${theme === "dark" ? " active" : ""}`}
                  data-theme="dark"
                  onclick="setTheme('dark')"
                >
                  <span class="icon">dark_mode</span> {t("settings.themeDark")}
                </button>
                <button
                  class={`theme-btn${theme === "light" ? " active" : ""}`}
                  data-theme="light"
                  onclick="setTheme('light')"
                >
                  <span class="icon">light_mode</span> {t("settings.themeLight")}
                </button>
              </div>
            </div>
          </div>

          <div class="bento-card">
            <div class="form-group">
              <label class="form-label">{t("settings.slugLength")}</label>
              <div class="slug-length-row">
                <input
                  class="form-input"
                  type="number"
                  id="slug-length-input"
                  min={String(MIN_SLUG_LENGTH)}
                  value={String(slugLength)}
                />
                <button class="btn btn-secondary btn-sm" onclick="saveSettings()">
                  {t("settings.save")}
                </button>
              </div>
              <div class="form-hint" id="slug-combo-hint">{comboHint}</div>
            </div>
          </div>

          <div class="bento-card">
            <div class="form-group">
              <label class="form-label">{t("settings.defaultRange")}</label>
              <div class="form-select">
                <select
                  class="form-input"
                  id="default-range-picker"
                  onchange="setDefaultRange(this.value)"
                >
                  {RANGE_OPTIONS.map((r) => (
                    <option value={r} selected={defaultRange === r}>
                      {t(`range.long.${r}` as const)}
                    </option>
                  ))}
                </select>
              </div>
              <div class="form-hint">{t("settings.defaultRangeHint")}</div>
            </div>
          </div>

          <div class="bento-card">
            <div class="form-group form-group-flush">
              <label class="form-label">{t("settings.analyticsFilters")}</label>
              <div class="toggle-row">
                <div>
                  <div class="toggle-label">{t("settings.filterBots")}</div>
                  <div class="toggle-hint">{t("settings.filterBotsHint")}</div>
                </div>
                <label class="toggle-switch">
                  <input
                    type="checkbox"
                    id="filter-bots-toggle"
                    checked={filterBots}
                    onchange="setFilterBots(this.checked)"
                  />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
              <div class="toggle-row">
                <div>
                  <div class="toggle-label">{t("settings.filterSelfReferrers")}</div>
                  <div class="toggle-hint">{t("settings.filterSelfReferrersHint")}</div>
                </div>
                <label class="toggle-switch">
                  <input
                    type="checkbox"
                    id="filter-self-referrers-toggle"
                    checked={filterSelfReferrers}
                    onchange="setFilterSelfReferrers(this.checked)"
                  />
                  <span class="toggle-track"></span>
                  <span class="toggle-thumb"></span>
                </label>
              </div>
            </div>
          </div>

          <div class="bento-card">
            <div class="form-group form-group-flush">
              <label class="form-label">{t("settings.version")}</label>
              <div id="version-status" class="version-status">
                <span class="icon icon-spin">progress_activity</span>
                <span>{t("settings.checkingUpdates")}</span>
              </div>
            </div>
          </div>

          {userEmail && (
            <div class="bento-card">
              <div class="form-group form-group-flush">
                <label class="form-label">{t("settings.account")}</label>
                <div class="account-row">
                  <div class="account-identity">
                    <span class="icon">person</span>
                    <span class="email">{userEmail}</span>
                  </div>
                  <a href="/_/admin/logout" class="account-logout">
                    <span class="icon">logout</span>
                    {t("nav.logout")}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div class="settings-side">
          <div class="bento-card" style="text-align:center;padding:2.5rem 1.5rem;display:flex;flex-direction:column;align-items:center;gap:1.2rem;">
            <img src={brandLogotype} alt="Cunlink" style="height:3.5rem;width:auto;display:block;" />
            <div style="font-family:var(--font-family-display);font-size:1rem;font-weight:600;color:var(--color-text-muted);letter-spacing:0.15em;">
              短链接 · 简单管理
            </div>
            <div style="margin-top:0.5rem;font-family:var(--font-family-body);font-size:0.8rem;color:var(--color-text-subtle);line-height:1.6;">
              由 <a href="https://cunzhangblog.com" target="_blank" rel="noopener" style="color:var(--color-accent);text-decoration:none;font-weight:600;">Web3村长</a> 维护
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
