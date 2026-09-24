const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const site = path.join(root, '_site');
const rules = require('../qa-rules.json');
const read = (route) => fs.readFileSync(path.join(site, route, 'index.html'), 'utf8');
const visibleText = (html) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

test('the approved fee terms occur on all English fee pages', () => {
  for (const route of rules.fees.englishRoutes) {
    const text = visibleText(read(route));
    for (const phrase of rules.fees.englishPhrases) {
      assert.ok(text.includes(phrase), `${route || '/'} missing: ${phrase}`);
    }
    for (const contradiction of rules.fees.bannedAbsolutePromises) {
      assert.ok(!text.includes(contradiction), `${route || '/'} still promises: ${contradiction}`);
    }
  }
});

test('Spanish fee pages retain the approved amounts and upfront charge', () => {
  for (const route of rules.fees.spanishRoutes) {
    const text = visibleText(read(route));
    for (const phrase of rules.fees.spanishPhrases) {
      assert.ok(text.includes(phrase), `${route} missing: ${phrase}`);
    }
    assert.ok(!text.includes('Nada por adelantado'), `${route} contradicts the upfront fee`);
  }
});

test('all rendered pages inherit the same contact number and footer', () => {
  const pages = ['','check/','programs/','pricing/','about/','contact/','es/','es/check/'];
  for (const route of pages) {
    const html = read(route);
    assert.ok(html.includes(`href="tel:${rules.phone.tel}"`), `${route} missing phone link`);
    assert.ok(html.includes('class="site-footer"'), `${route} missing shared footer`);
  }
});

test('English navigation contains only the approved top-level destinations', () => {
  const nav = read('').match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav, 'home page has no navigation');
  for (const href of rules.navigation.hrefs) {
    assert.ok(nav.includes(`href="${href}"`), `navigation missing ${href}`);
  }
  assert.match(nav, /Call us now:/);
  assert.match(nav, /Español/);
});

test('the home page contains the approved claim, team, process, and contact sections', () => {
  const html = read('');
  for (const id of rules.home.sectionIds) {
    assert.ok(html.includes(`id="${id}"`), `home page missing #${id}`);
  }
  assert.match(html, /Filed over 3,000 claims with over 20 years of experience/);
  assert.match(html, /<img[^>]+claims-specialist-consultation\.jpg/);
});

test('Spanish draft stays out of the index and sitemap', () => {
  assert.match(read('es/'), /name="robots" content="noindex,nofollow"/);
  const sitemap = fs.readFileSync(path.join(site, 'sitemap.xml'), 'utf8');
  assert.ok(!sitemap.includes('/es/'), 'draft Spanish pages are in sitemap');
});
