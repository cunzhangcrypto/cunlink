// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

export class SettingRepository {
  static async get(db: D1Database, identity: string, key: string): Promise<string | null> {
    const row = await db
      .prepare("SELECT value FROM settings WHERE identity = ? AND key = ?")
      .bind(identity, key)
      .first<{ value: string }>();
    return row?.value ?? null;
  }

  static async set(db: D1Database, identity: string, key: string, value: string): Promise<void> {
    await db
      .prepare("INSERT INTO settings (identity, key, value) VALUES (?, ?, ?) ON CONFLICT(identity, key) DO UPDATE SET value = ?")
      .bind(identity, key, value, value)
      .run();
  }
}
