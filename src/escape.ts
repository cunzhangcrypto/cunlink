// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

/**
 * Escapes a string for safe inclusion in an HTML attribute value delimited
 * by double quotes. Safe for href, title, data-*, and similar.
 *
 * NOT sufficient on its own when the value is later interpolated inside a
 * JS string literal in an inline `onclick` attribute: the HTML parser
 * decodes entities before the script engine sees them, so `&#39;` reverts
 * to `'` and still breaks out of `'…'`. For that case, prefer `data-*`
 * attributes plus a delegated JS handler that reads via `dataset`.
 */
export function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
