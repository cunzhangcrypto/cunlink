// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import { render } from "preact";
import { Options } from "./Options";
import "./options.css";

const root = document.getElementById("root");
if (root) {
  render(<Options />, root);
}
