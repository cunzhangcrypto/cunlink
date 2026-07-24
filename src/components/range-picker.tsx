// Copyright 2026 Oddbit (https://oddbit.id)
// SPDX-License-Identifier: Apache-2.0

import type { FC } from "hono/jsx";
import type { TimelineRange } from "../types";

type Option = { value: TimelineRange; label: string };

type RangePickerProps = {
  current: TimelineRange;
  basePath: string;
  options?: Option[];
  preserveParams?: Record<string, string | undefined>;
};

const DEFAULT_OPTIONS: Option[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
];

export const RangePicker: FC<RangePickerProps> = ({ current, basePath, options = DEFAULT_OPTIONS, preserveParams }) => {
  return (
    <div class="range-picker" role="group" aria-label="Select time range">
      {options.map((o) => {
        const params = new URLSearchParams();
        if (preserveParams) {
          for (const [k, v] of Object.entries(preserveParams)) {
            if (v) params.set(k, v);
          }
        }
        params.set("range", o.value);
        const href = `${basePath}?${params.toString()}`;
        return (
          <a href={href} class={o.value === current ? "active" : ""} data-range={o.value}>{o.label}</a>
        );
      })}
    </div>
  );
};
