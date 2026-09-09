import { describe, expect, it } from "vitest";
import { cn } from "../../../src/renderer/lib/utils";

describe("cn", () => {
  it("複数のクラス名を空白区切りで結合する", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("falsyな値を無視する", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("競合するTailwindクラスは後勝ちでマージする", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
