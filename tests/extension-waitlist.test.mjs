import assert from "node:assert/strict";
import test from "node:test";

let servedHandler;
globalThis.Deno = { env: { get: () => undefined }, serve: handler => { servedHandler = handler; } };
const { handleWaitlist } = await import("../supabase/functions/extension-waitlist/index.ts");
const env = { get: name => ({
  SUPABASE_URL: "https://project.example.invalid",
  SUPABASE_SERVICE_ROLE_KEY: "fixture-secret",
})[name] };
const url = "https://project.example.invalid/rest/v1/rpc/join_extension_waitlist";
const request = (email, extra = {}) => new Request("https://project.example.invalid/functions/v1/extension-waitlist", {
  method: "POST",
  headers: { Origin: "https://propeljobagent.com", "Content-Type": "application/json", "x-real-ip": "192.0.2.1",
    ...extra.headers },
  body: JSON.stringify({ email, website: "", ...extra.body }),
});
const mock = code => async (path, init) => {
  assert.equal(path, url);
  assert.equal(init.method, "POST");
  assert.equal(init.headers.Authorization, "Bearer fixture-secret");
  const body = JSON.parse(init.body);
  assert.match(body.p_rate_key, /^[0-9a-f]{64}$/);
  return new Response(JSON.stringify(code), { status: 200 });
};

test("valid signup is normalized and only a joined result reports success", async () => {
  const result = await handleWaitlist(request("  Person+One@Example.COM  "), env, async (path, init) => {
    assert.equal(JSON.parse(init.body).p_email, "person+one@example.com");
    return mock("joined")(path, init);
  });
  assert.equal(result.status, 201);
  assert.deepEqual(await result.json(), { code: "joined" });
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), "https://propeljobagent.com");
});

test("duplicate and rate limit are distinct states", async () => {
  for (const [code, status] of [["already_joined", 200], ["rate_limited", 429]]) {
    const result = await handleWaitlist(request("person@example.com"), env, mock(code));
    assert.equal(result.status, status);
    assert.deepEqual(await result.json(), { code });
  }
});

test("invalid, bot and foreign-origin submissions never reach storage", async () => {
  const unreachable = () => { throw Error("must not call backend"); };
  assert.equal((await handleWaitlist(request("bad"), env, unreachable)).status, 400);
  assert.equal((await handleWaitlist(request("person@example.com", { body: { website: "bot" } }), env, unreachable)).status, 400);
  assert.equal((await handleWaitlist(request("person@example.com", { headers: { Origin: "https://other.example" } }), env, unreachable)).status, 403);
  assert.equal((await handleWaitlist(request("person@example.com", { headers: { "x-real-ip": "" } }), env, unreachable)).status, 503);
});

test("backend error does not falsely report a joined waitlist", async () => {
  const failed = await handleWaitlist(request("person@example.com"), env,
    async () => new Response("{}", { status: 503 }));
  assert.equal(failed.status, 503);
  assert.deepEqual(await failed.json(), { code: "waitlist_unavailable" });
});

test("Deno's extra connection-info argument cannot replace the function environment", async () => {
  const result = await servedHandler(request("person@example.com"), { remoteAddr: {} });
  assert.equal(result.status, 503);
  assert.deepEqual(await result.json(), { code: "waitlist_unavailable" });
});

test("browser preflight succeeds for the Propel site", async () => {
  const result = await handleWaitlist(new Request("https://project.example.invalid/functions/v1/extension-waitlist", {
    method: "OPTIONS", headers: { Origin: "https://propeljobagent.com", "Access-Control-Request-Method": "POST",
      "Access-Control-Request-Headers": "apikey, content-type" },
  }), env, () => { throw Error("must not call backend"); });
  assert.equal(result.status, 204);
  assert.equal(result.headers.get("Access-Control-Allow-Origin"), "https://propeljobagent.com");
});
