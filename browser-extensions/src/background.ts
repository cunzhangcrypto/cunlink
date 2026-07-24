// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0
//
// MV3 service worker. Single responsibility: open the options page on
// fresh install when no config is saved. Does nothing on update events
// (the user already configured once).

import { getConfig } from "./storage";

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install") return;
  const config = await getConfig();
  if (config) return;
  await chrome.runtime.openOptionsPage();
});
