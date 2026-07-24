// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import { DEPLOY_CTA_URL } from "../constants";
import type { TranslateFn } from "../i18n";

type Props = {
  t: TranslateFn;
  variant?: "popup" | "banner";
};

export function DeployCta({ t, variant = "banner" }: Props) {
  return (
    <aside class={`cta cta-${variant}`} role="complementary">
      <div class="cta-text">
        <h3 class="cta-heading">{t("cta.heading")}</h3>
        <p class="cta-body">{t("cta.body")}</p>
      </div>
      <a class="cta-button" href={DEPLOY_CTA_URL} target="_blank" rel="noopener noreferrer">
        {t("cta.button")}
      </a>
    </aside>
  );
}
