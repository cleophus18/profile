export default async function run(page, ui) {
  await page.waitForTimeout(4500);
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.waitForTimeout(600);
  await page.locator(".skills").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: "d3-skills.png" });
  return { ok: true };
}
