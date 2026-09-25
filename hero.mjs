export default async function run(page, ui) {
  await page.waitForTimeout(4500);
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: "d1-hero.png" });

  // Zoom the nav area so the logo is actually judgeable
  const brand = await page.locator("header.nav").boundingBox();
  await page.screenshot({
    path: "d2-nav.png",
    clip: { x: brand.x, y: brand.y, width: brand.width, height: brand.height },
  });

  return { brand, loader: await page.locator(".loading-screen").count() };
}
