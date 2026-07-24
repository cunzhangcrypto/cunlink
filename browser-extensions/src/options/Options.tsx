// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0
//
// Options page. Lifecycle is independent from popup: edits the saved
// config, surfaces the deploy CTA whenever no config exists yet, and
// remains open after Save (no auto-close).

import { useEffect, useState } from "preact/hooks";
import { getConfig, type Config } from "../storage";
import { ConfigForm } from "../components/ConfigForm";
import { DeployCta } from "../components/DeployCta";
import { PROJECT_INFO_URL } from "../constants";
import { createTranslateFn, detectLanguage } from "../i18n";

type LoadState =
  | { kind: "loading" }
  | { kind: "ready"; config: Config | null }
  | { kind: "saved"; config: Config };

export function Options() {
  const [loadState, setLoadState] = useState<LoadState>({ kind: "loading" });
  const t = createTranslateFn(detectLanguage());

  useEffect(() => {
    getConfig().then((config) => {
      setLoadState({ kind: "ready", config });
    });
  }, []);

  const initial = loadState.kind === "ready" ? loadState.config : loadState.kind === "saved" ? loadState.config : null;
  const ctaVisible = loadState.kind === "ready" && loadState.config === null;
  const showSaved = loadState.kind === "saved";

  return (
    <main class="options">
      <header class="options-header">
        <h1 class="options-title">{t("options.title")}</h1>
        <p class="options-subtitle">{t("options.subtitle")}</p>
      </header>

      {ctaVisible && (
        <div class="options-cta">
          <DeployCta t={t} variant="banner" />
        </div>
      )}

      <section class="options-section" aria-labelledby="connection-heading">
        <h2 id="connection-heading" class="options-section-heading">
          {t("options.section.connection")}
        </h2>
        <p class="options-section-body">{t("options.section.connection.body")}</p>
        {loadState.kind !== "loading" && (
          <ConfigForm
            t={t}
            initial={initial}
            onSaved={(config) => {
              setLoadState({ kind: "saved", config });
            }}
          />
        )}
        {showSaved && (
          <p class="form-status form-status-ok" role="status">
            ✓ {t("form.saved")}
          </p>
        )}
      </section>

      <section class="options-section" aria-labelledby="about-heading">
        <h2 id="about-heading" class="options-section-heading">
          {t("options.section.about")}
        </h2>
        <p class="options-section-body">{t("options.section.about.body")}</p>
        <p class="options-section-body">
          <a class="link" href={PROJECT_INFO_URL} target="_blank" rel="noopener noreferrer">
            {t("options.section.about.website")}
          </a>
        </p>
      </section>
    </main>
  );
}
