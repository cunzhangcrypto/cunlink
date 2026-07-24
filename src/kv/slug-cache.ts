// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

export interface SlugCacheEntry {
  url: string;
  disabled_at: number | null;
  expires_at: number | null;
}

export class SlugCache {
  static async get(kv: KVNamespace | undefined, slug: string): Promise<SlugCacheEntry | null> {
    if (!kv) return null;
    return kv.get<SlugCacheEntry>(slug, "json");
  }

  static async put(kv: KVNamespace | undefined, slug: string, entry: SlugCacheEntry): Promise<void> {
    if (!kv) return;
    await kv.put(slug, JSON.stringify(entry));
  }

  static async delete(kv: KVNamespace | undefined, slug: string): Promise<void> {
    if (!kv) return;
    await kv.delete(slug);
  }
}
