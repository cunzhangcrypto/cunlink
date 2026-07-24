// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import { SettingRepository } from "../db";
import type { ClickFilters } from "../db";
import { DEFAULT_SLUG_LENGTH, DEFAULT_TIMELINE_RANGE, MAX_TITLE_LENGTH, THEMES, TIMELINE_RANGES } from "../constants";
import { SUPPORTED_LANGUAGES } from "../i18n";
import { validateSlugLength } from "../slugs";
import { Env, TimelineRange } from "../types";
import { ServiceResult, ok, fail } from "./result";

const VALID_RANGES = new Set<TimelineRange>(TIMELINE_RANGES);

function isValidRange(v: unknown): v is TimelineRange {
  return typeof v === "string" && VALID_RANGES.has(v as TimelineRange);
}

export type { ServiceResult };

export type AppSettings = {
  slug_default_length: number;
  theme: string | null;
  lang: string | null;
  default_range: TimelineRange;
  filter_bots: boolean;
  filter_self_referrers: boolean;
};

// Stored as "true" / "false" strings in the key-value settings table; absent row
// means default-on so fresh installs exclude bots and self-referrers everywhere.
function parseBoolSetting(v: string | null, defaultValue: boolean): boolean {
  if (v === null) return defaultValue;
  if (v === "true") return true;
  if (v === "false") return false;
  return defaultValue;
}

export async function getAppSettings(
  env: Env,
  identity: string,
): Promise<ServiceResult<AppSettings>> {
  const [slugLength, theme, lang, defaultRange, filterBots, filterSelfReferrers] = await Promise.all([
    SettingRepository.get(env.DB, identity, "slug_default_length"),
    SettingRepository.get(env.DB, identity, "theme"),
    SettingRepository.get(env.DB, identity, "lang"),
    SettingRepository.get(env.DB, identity, "default_range"),
    SettingRepository.get(env.DB, identity, "filter_bots"),
    SettingRepository.get(env.DB, identity, "filter_self_referrers"),
  ]);
  // A corrupted or out-of-bounds stored value must not poison link creation
  // or the settings page; fall back to the hardcoded default instead.
  // Theme and lang clamp to their allowed sets on read as well: rows written
  // before write-side validation existed (or edited directly in D1) must not
  // leak unknown values to settings consumers. Null means "unset"; callers
  // apply their own defaults.
  const parsedSlugLength = parseInt(slugLength ?? String(DEFAULT_SLUG_LENGTH), 10);
  return ok({
    slug_default_length: validateSlugLength(parsedSlugLength) === null ? parsedSlugLength : DEFAULT_SLUG_LENGTH,
    theme: theme !== null && (THEMES as readonly string[]).includes(theme) ? theme : null,
    lang: lang !== null && (SUPPORTED_LANGUAGES as readonly string[]).includes(lang) ? lang : null,
    default_range: isValidRange(defaultRange) ? defaultRange : DEFAULT_TIMELINE_RANGE,
    filter_bots: parseBoolSetting(filterBots, true),
    filter_self_referrers: parseBoolSetting(filterSelfReferrers, true),
  });
}

export async function updateAppSettings(
  env: Env,
  identity: string,
  body: {
    slug_default_length?: number;
    theme?: string;
    lang?: string;
    default_range?: TimelineRange | null | "";
    filter_bots?: boolean;
    filter_self_referrers?: boolean;
  },
): Promise<ServiceResult<AppSettings>> {
  if (body.slug_default_length !== undefined) {
    const err = validateSlugLength(body.slug_default_length);
    if (err) return fail(400, err);
    await SettingRepository.set(env.DB, identity, "slug_default_length", String(body.slug_default_length));
  }
  if (body.theme !== undefined) {
    if (typeof body.theme !== "string" || !(THEMES as readonly string[]).includes(body.theme)) {
      return fail(400, `theme must be one of: ${THEMES.join(", ")}`);
    }
    await SettingRepository.set(env.DB, identity, "theme", body.theme);
  }
  if (body.lang !== undefined) {
    if (typeof body.lang !== "string" || !(SUPPORTED_LANGUAGES as readonly string[]).includes(body.lang)) {
      return fail(400, `lang must be one of: ${SUPPORTED_LANGUAGES.join(", ")}`);
    }
    await SettingRepository.set(env.DB, identity, "lang", body.lang);
  }
  if (body.default_range !== undefined) {
    if (body.default_range === null || body.default_range === "") {
      await SettingRepository.set(env.DB, identity, "default_range", "");
    } else if (isValidRange(body.default_range)) {
      await SettingRepository.set(env.DB, identity, "default_range", body.default_range);
    } else {
      return fail(400, `default_range must be one of: ${TIMELINE_RANGES.join(", ")}`);
    }
  }
  if (body.filter_bots !== undefined) {
    if (typeof body.filter_bots !== "boolean") {
      return fail(400, "filter_bots must be a boolean");
    }
    await SettingRepository.set(env.DB, identity, "filter_bots", String(body.filter_bots));
  }
  if (body.filter_self_referrers !== undefined) {
    if (typeof body.filter_self_referrers !== "boolean") {
      return fail(400, "filter_self_referrers must be a boolean");
    }
    await SettingRepository.set(env.DB, identity, "filter_self_referrers", String(body.filter_self_referrers));
  }

  return getAppSettings(env, identity);
}

/**
 * Resolve the viewer's analytics filter preferences into a ClickFilters object
 * ready to pass to the repository layer.
 */
export async function resolveClickFilters(env: Env, identity: string): Promise<ClickFilters> {
  const result = await getAppSettings(env, identity);
  if (!result.ok) return { excludeBots: true, excludeSelfReferrers: true };
  return {
    excludeBots: result.data.filter_bots,
    excludeSelfReferrers: result.data.filter_self_referrers,
  };
}
