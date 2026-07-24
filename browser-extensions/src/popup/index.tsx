// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import { render } from "preact";
import { Popup } from "./Popup";
import "./popup.css";

const root = document.getElementById("root");
if (root) {
  render(<Popup />, root);
}
