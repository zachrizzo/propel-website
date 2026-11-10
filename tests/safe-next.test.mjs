import test from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../lib/supabase/config.ts";

test("keeps paths on this site", () => {
  assert.equal(safeNext("/account"), "/account");
  assert.equal(safeNext("/account/password?x=1#top"), "/account/password?x=1#top");
});

test("refuses destinations a browser resolves to another origin", () => {
  for (const value of ["//evil.example", "/\\evil.example", "/\t/evil.example", "/\n/evil.example", "/\r/evil.example", "/\\\t/evil.example", "https://evil.example", "evil.example", "", null, undefined]) {
    assert.equal(safeNext(value), "/account", JSON.stringify(value));
  }
});

test("uses the given fallback", () => {
  assert.equal(safeNext("//evil.example", "/login"), "/login");
});
