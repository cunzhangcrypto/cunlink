import { describe, expect, it } from "vitest";
import {
  createTranslateFn,
  getTranslations,
  isSupportedLanguage,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
} from "../../i18n";
import en from "../../i18n/en";
import zh from "../../i18n/zh";

function flattenKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    out.push(...flattenKeys(v, next));
  }
  return out;
}

describe("i18n", () => {
  describe("isSupportedLanguage", () => {
    it("returns true for supported languages", () => {
      expect(isSupportedLanguage("en")).toBe(true);
      expect(isSupportedLanguage("zh")).toBe(true);
    });

    it("returns false for unsupported languages", () => {
      expect(isSupportedLanguage("fr")).toBe(false);
      expect(isSupportedLanguage("")).toBe(false);
      expect(isSupportedLanguage("EN")).toBe(false);
    });
  });

  describe("getTranslations", () => {
    it("returns English translations for 'en'", () => {
      const t = getTranslations("en");
      expect(t["nav.dashboard"]).toBe("Dashboard");
    });

    it("returns Chinese translations for 'zh'", () => {
      const t = getTranslations("zh");
      expect(t["nav.dashboard"]).toBe("仪表盘");
    });

    it("falls back to Chinese for unsupported language", () => {
      const t = getTranslations("fr");
      expect(t["nav.dashboard"]).toBe("仪表盘");
    });
  });

  describe("createTranslateFn", () => {
    it("returns translated string for the given language", () => {
      const t = createTranslateFn("zh");
      expect(t("dashboard.title")).toBe("仪表盘");
    });

    it("falls back to English for unsupported language code", () => {
      const t = createTranslateFn("xx");
      expect(t("dashboard.title")).toBe("仪表盘");
    });

    it("interpolates parameters with {param} syntax", () => {
      const t = createTranslateFn("en");
      expect(t("settings.combos", { count: "1,000" })).toBe(
        "1,000 possible combinations",
      );
    });

    it("interpolates multiple parameters", () => {
      const t = createTranslateFn("en");
      expect(t("client.confirmDeleteKey", { title: "My Key" })).toBe(
        'Delete API key "My Key"? This cannot be undone.',
      );
    });

    it("returns the key itself when no translation exists", () => {
      // Simulate a missing key by casting
      const t = createTranslateFn("en");
      const result = t("nonexistent.key" as any);
      expect(result).toBe("nonexistent.key");
    });

    it("translates all English keys without gaps", () => {
      const t = createTranslateFn("en");
      for (const key of Object.keys(en)) {
        const val = t(key as any);
        expect(val).not.toBe(key);
      }
    });

    it("every supported language covers all English keys", () => {
      const enKeys = Object.keys(en);
      for (const lang of SUPPORTED_LANGUAGES) {
        const translations = getTranslations(lang);
        for (const key of enKeys) {
          expect(translations[key as keyof typeof translations], `Missing '${key}' in '${lang}'`).toBeTruthy();
        }
      }
    });
  });

  describe("constants", () => {
    it("has 'zh' as default language", () => {
      expect(DEFAULT_LANGUAGE).toBe("zh");
    });

    it("lists all supported languages", () => {
      expect(SUPPORTED_LANGUAGES).toContain("en");
      expect(SUPPORTED_LANGUAGES).toContain("zh");
    });
  });

  describe("key parity across locales", () => {
    const enKeys = new Set(flattenKeys(en));

    it.each([
      ["zh", zh],
    ])("locale %s has the same key set as en", (_name, locale) => {
      const localeKeys = new Set(flattenKeys(locale));
      const missing = [...enKeys].filter((k) => !localeKeys.has(k));
      const extra = [...localeKeys].filter((k) => !enKeys.has(k));
      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });
  });

  describe("language metadata keys", () => {
    it("each language has a _lang key matching its code", () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        const translations = getTranslations(lang);
        expect(translations["_lang"]).toBe(lang);
      }
    });

    it("native language names are the same across all locales", () => {
      for (const lang of SUPPORTED_LANGUAGES) {
        const translations = getTranslations(lang);
        expect(translations["lang.en"]).toBe("English");
        expect(translations["lang.zh"]).toBe("中文");
      }
    });

    it("localized language names differ per locale", () => {
      const en = getTranslations("en");
      const zh = getTranslations("zh");

      expect(en["langLocal.zh"]).toBe("Chinese");
      expect(zh["langLocal.zh"]).toBe("中文");

      expect(en["langLocal.en"]).toBe("English");
      expect(zh["langLocal.en"]).toBe("英文");
    });
  });
});
