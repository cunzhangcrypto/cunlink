// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import { OpenAPIHono } from "@hono/zod-openapi";
import { formatZodError } from "./response";
import type { HonoEnv } from "./hono-env";

export function createApiSubApp(): OpenAPIHono<HonoEnv> {
  return new OpenAPIHono<HonoEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({ error: formatZodError(result.error) }, 400);
      }
    },
  });
}
