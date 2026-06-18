// Submit the site's URLs to IndexNow (Bing, Yandex, Seznam, Naver — account-free).
// Bing's index feeds ChatGPT/Copilot AI search, so this helps AI assistants
// discover Propel. Google does NOT support IndexNow — for Google, verify the site
// in Search Console and submit sitemap.xml there.
//
// Usage: node scripts/indexnow.mjs
//
// The key below is also hosted at /<key>.txt so IndexNow can verify ownership.

const KEY = "a3f1c8e7b9d24056af13c7e9b0d6428f";
const HOST = "propeljobagent.vercel.app";
const ORIGIN = `https://${HOST}`;

const urlList = [`${ORIGIN}/`, `${ORIGIN}/privacy`, `${ORIGIN}/llms.txt`];

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `${ORIGIN}/${KEY}.txt`,
  urlList,
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log(`IndexNow → ${res.status} ${res.statusText}`);
console.log(`Submitted ${urlList.length} URLs:`, urlList.join(", "));
if (!res.ok && res.status !== 202 && res.status !== 200) {
  console.log("Response body:", await res.text());
  process.exitCode = 1;
}
