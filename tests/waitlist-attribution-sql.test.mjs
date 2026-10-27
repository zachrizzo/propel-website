import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Reuse the installed backend test dependency without changing either project's dependencies.
const require = createRequire(process.env.PROPEL_PGLITE_PACKAGE ?? new URL("../package.json", import.meta.url));
const { PGlite } = require("@electric-sql/pglite");
const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const migration = read("../supabase/migrations/20261027015056_tiktok_waitlist_attribution.sql");
const counts = read("../database/tiktok-conversion-counts.sql");

async function setup() {
  const db = new PGlite();
  await db.exec(read("./fixtures/waitlist-baseline.sql"));
  await db.exec("insert into extension_waitlist(email) values ('existing@company.dev')");
  const acl = (await db.query("select proacl::text as acl from pg_proc where oid='public.join_extension_waitlist(text,text)'::regprocedure")).rows[0].acl;
  await db.exec(migration);
  return { db, acl };
}
async function join(db, email, source = null, key = "a".repeat(64)) {
  await db.exec("set role service_role");
  try {
    await db.query("select set_config('request.headers',$1,false)", [JSON.stringify(source ? {"x-propel-signup-source":source} : {})]);
    return (await db.query("select join_extension_waitlist($1,$2) as result",[email,key])).rows[0].result;
  } finally { await db.exec("reset role"); }
}

test("first successful signup stores source once; duplicates cannot claim an existing lead", async () => {
  const { db, acl } = await setup();
  try {
    assert.equal(await join(db,"lead@company.dev","tiktok"),"joined");
    assert.equal(await join(db,"LEAD@company.dev",null),"already_joined");
    assert.equal(await join(db,"existing@company.dev","tiktok"),"already_joined");
    assert.equal(await join(db,"plain@company.dev","unsupported"),"joined");
    assert.equal((await db.query("select signup_source from extension_waitlist where email='lead@company.dev'")).rows[0].signup_source,"tiktok");
    assert.equal((await db.query("select signup_source from extension_waitlist where email='existing@company.dev'")).rows[0].signup_source,null);
    assert.equal((await db.query("select signup_source from extension_waitlist where email='plain@company.dev'")).rows[0].signup_source,null);
    await db.exec(migration);
    assert.equal((await db.query("select proacl::text as acl from pg_proc where oid='public.join_extension_waitlist(text,text)'::regprocedure")).rows[0].acl,acl);
    assert.equal((await db.query("select count(*)::int n from extension_waitlist")).rows[0].n,3);
  } finally { await db.close(); }
});

test("reserved QA addresses are counted separately from new non-test conversions", async () => {
  const { db } = await setup();
  try {
    assert.equal(await join(db,"qa@example.invalid","tiktok"),"joined");
    assert.equal(await join(db,"lead@company.dev","tiktok"),"joined");
    assert.equal(await join(db,"qa@example.invalid","tiktok"),"already_joined");
    const total = (await db.query(counts)).rows.find(r=>r.utc_day==="TOTAL");
    assert.equal(Number(total.tiktok_signups_excluding_tests),1);
    assert.equal(Number(total.tiktok_test_signups),1);
  } finally { await db.close(); }
});

test("anonymous and authenticated users still cannot read, write, or directly invoke signup storage", async () => {
  const { db } = await setup();
  try {
    for (const role of ["anon","authenticated"]) {
      await db.exec(`set role ${role}`);
      for (const sql of ["select * from extension_waitlist", "insert into extension_waitlist(email,signup_source) values('x@company.dev','tiktok')", "select join_extension_waitlist('x@company.dev','"+"a".repeat(64)+"')"]) {
        await assert.rejects(db.exec(sql),/permission denied/);
      }
      await db.exec("reset role");
    }
  } finally { await db.close(); }
});

test("rate limiting and rollback preserve records without counting failed submissions", async () => {
  const { db } = await setup();
  try {
    for (let n=0;n<5;n++) assert.equal(await join(db,`lead${n}@company.dev`,"tiktok"),"joined");
    assert.equal(await join(db,"limited@company.dev","tiktok"),"rate_limited");
    assert.equal((await db.query("select count(*)::int n from extension_waitlist where signup_source='tiktok'")).rows[0].n,5);
    await db.exec(read("../database/tiktok-waitlist-attribution-rollback.sql"));
    assert.equal((await db.query("select count(*)::int n from extension_waitlist where signup_source='tiktok'")).rows[0].n,5);
    assert.equal(await join(db,"after@company.dev","tiktok","b".repeat(64)),"joined");
    assert.equal((await db.query("select signup_source from extension_waitlist where email='after@company.dev'")).rows[0].signup_source,null);
  } finally { await db.close(); }
});
