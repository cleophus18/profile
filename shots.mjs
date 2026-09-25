export default async function run(page, ui) {
  await page.waitForTimeout(4200);
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: "view-1-hero.png" });

  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "view-2-about.png" });

  await page.locator(".skills").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "view-3-skills.png" });

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "view-4-contact.png" });

  return { done: true };
}
