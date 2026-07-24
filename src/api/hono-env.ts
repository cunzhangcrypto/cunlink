// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import type { Env } from "../types";
import type { AccessUser } from "../access";

export type HonoEnv = {
  Bindings: Env;
  Variables: {
    user: AccessUser | null;
    identity: string;
  };
};
