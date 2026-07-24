// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0
//
// Allow side-effect CSS imports in TypeScript modules. esbuild handles
// the actual bundling; TypeScript only needs to acknowledge the import.

declare module "*.css";
