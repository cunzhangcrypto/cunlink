import { describe, expect, it } from "vitest";
import { fmtNumber } from "../../i18n/format";

describe("fmtNumber", () => {
  it("uses comma thousands separators for en", () => {
    expect(fmtNumber(1234567, "en")).toBe("1,234,567");
  });

  it("uses comma thousands separators for zh", () => {
    expect(fmtNumber(1234567, "zh")).toBe("1,234,567");
  });

  it("formats zero and negative values", () => {
    expect(fmtNumber(0, "en")).toBe("0");
    expect(fmtNumber(-12345, "en")).toBe("-12,345");
  });

  it("leaves small numbers unseparated", () => {
    expect(fmtNumber(42, "en")).toBe("42");
    expect(fmtNumber(999, "zh")).toBe("999");
  });
});
