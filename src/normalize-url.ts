// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

/**
 * Strips trailing characters that serve no purpose from a URL:
 * trailing `/`, `#` (without an anchor), and `?` (without parameters).
 */
export function normalizeUrl(url: string): string {
  return url.replace(/[/?#]+$/, "");
}
