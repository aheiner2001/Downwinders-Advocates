const { test, expect } = require('@playwright/test');
const rules = require('../../qa-rules.json');

// The local site is the subject of these tests; third-party embeds must not make CI flaky.
test.beforeEach(async ({ page }) => {
  await page.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.abort());
});

test('homepage hero, navigation, phone, and consultation image render', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero-white')).toBeVisible();
  await expect.poll(() => page.locator('.hero-white img').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByText('Filed over 3,000 claims with over 20 years of experience')).toBeVisible();
  for (const href of rules.navigation.hrefs) {
    await expect(page.locator(`nav a[href="${href}"]`).first()).toBeAttached();
  }
  await expect(page.locator(`a[href="tel:${rules.phone.tel}"]`).first()).toBeAttached();
});

test('pricing renders the approved disclosed fees', async ({ page }) => {
  await page.goto('/pricing/');
  for (const phrase of rules.fees.englishPhrases) {
    await expect(page.locator('body')).toContainText(phrase);
  }
});

test('private eligibility preview produces on-page guidance', async ({ page }) => {
  await page.goto('/check/');
  await page.locator('input[name="place"][value="state"]').check();
  await page.locator('input[name="years"][value="ok"]').check();
  await page.locator('input[name="who"][value="self"]').check();
  await page.getByRole('button', { name: /See Initial Guidance/ }).click();
  await expect(page.locator('#out')).not.toBeEmpty();
  await expect(page).toHaveURL(/\/check\/$/);
});

test('mobile viewport does not overflow horizontally', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const dimensions = await page.evaluate(() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport + 1);
});
