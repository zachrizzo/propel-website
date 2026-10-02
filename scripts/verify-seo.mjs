// Read-only checks of rendered search metadata. Run against the local production server
// or the live site after deployment: node scripts/verify-seo.mjs https://propeljobagent.com
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const origin = process.argv[2] || 'http://127.0.0.1:6431';
const canonicalOrigin = 'https://propeljobagent.com';
const publicPaths = ['/', '/pricing', '/job-application-agent', '/how-to-auto-apply-to-jobs', '/privacy'];
const meta = (html, name) => [...html.matchAll(/<meta\s+([^>]+)>/g)].map(m => m[1]).filter(a => a.includes(`name="${name}"`) || a.includes(`property="${name}"`)).map(a => a.match(/content="([^"]*)"/)?.[1]);
const decode = text => text.replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
let checks = 0;
for (const path of publicPaths) {
  const response = await fetch(origin + path, { headers: { 'User-Agent': 'Googlebot' } });
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/); 
  assert.equal(canonical?.[1], canonicalOrigin + (path === '/' ? '' : path), `canonical ${path}`);
  assert.equal(meta(html, 'robots')[0], 'index, follow', `indexable ${path}`);
  assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1, `one h1 ${path}`);
  assert.ok(meta(html, 'description')[0]?.length, `description ${path}`);
  assert.ok(meta(html, 'og:image')[0]?.startsWith(canonicalOrigin), `OG image ${path}`);
  assert.ok(meta(html, 'twitter:image')[0]?.startsWith(canonicalOrigin), `Twitter image ${path}`);
  if (!['/', '/privacy'].includes(path)) {
    assert.equal(decode(meta(html, 'twitter:title')[0]), decode(meta(html, 'og:title')[0]), `own social title ${path}`);
    assert.equal(decode(meta(html, 'twitter:description')[0]), decode(meta(html, 'description')[0]), `own social description ${path}`);
    assert.equal(meta(html, 'og:url')[0], canonicalOrigin + path, `own social URL ${path}`);
  }
  const json = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  assert.ok(json.length, `JSON-LD ${path}`);
  assert.ok(!JSON.stringify(json).includes('AggregateOffer'), `no premature extension offer ${path}`);
  if (path === '/pricing') {
    const product = json.flatMap(x => x['@graph'] || [x]).find(x => x['@type'] === 'Product');
    assert.equal(product?.name, 'Propel account plans');
    assert.ok(product.offers.length && product.offers.every(x => /^\d+\.\d{2}$/.test(x.price)), 'catalog prices');
  }
  console.log(`PASS public ${path}`); checks++;
}
for (const path of ['/login', '/account', '/account/password', '/account/deleted', '/billing/cancel', '/billing/success']) {
  const response = await fetch(origin + path);
  const html = await response.text();
  assert.equal(meta(html, 'robots')[0], 'noindex, nofollow', `private ${path}`);
  console.log(`PASS noindex ${path}`); checks++;
}
const callback = await fetch(origin + '/auth/extension-callback');
assert.match(callback.headers.get('x-robots-tag') || '', /noindex/);
assert.equal(callback.headers.get('referrer-policy'), 'no-referrer');
console.log('PASS callback noindex and no-referrer'); checks++;
const robots = await (await fetch(origin + '/robots.txt')).text();
assert.ok(robots.includes('Disallow: /auth/'));
assert.ok(robots.includes('Sitemap: ' + canonicalOrigin + '/sitemap.xml'));
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
assert.equal((sitemap.match(/<loc>/g) || []).length, publicPaths.length);
assert.ok(!/\/(account|auth|login|billing|download)/.test(sitemap));
for (const path of publicPaths) assert.ok(sitemap.includes(`<loc>${canonicalOrigin}${path === '/' ? '' : path}</loc>`));
console.log('PASS robots and public-only sitemap'); checks++;
const imageResponse = await fetch(origin + '/opengraph-image');
assert.equal(imageResponse.status, 200);
const image = Buffer.from(await imageResponse.arrayBuffer());
assert.equal(image.readUInt32BE(16), 1200); assert.equal(image.readUInt32BE(20), 630);
await writeFile('/tmp/propel-seo-validation/opengraph.png', image);
console.log('PASS OG PNG 1200x630'); checks++;
console.log(`${checks} SEO checks passed on ${origin}`);
