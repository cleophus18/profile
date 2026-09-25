export default async function run(page, ui) {
  const out = {};
  await page.waitForTimeout(3500);

  // Is the loading overlay still intercepting pointer events after it fades?
  out.elementAtCenter = await page.evaluate(() => {
    const el = document.elementFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2,
    );
    return el ? `${el.tagName}.${el.className}`.slice(0, 80) : null;
  });

  // Can we actually click a nav link through the overlay area?
  const navLink = page.locator('header.nav nav a[href="#projects"]');
  out.navClickable = await navLink
    .click({ timeout: 3000 })
    .then(() => true)
    .catch((e) => String(e).split("\n")[0]);

  await page.waitForTimeout(600);
  out.hashAfterClick = await page.evaluate(() => window.location.hash);
  out.scrollY = await page.evaluate(() => Math.round(window.scrollY));

  // Repo count state now that the API 403s
  out.repoCountText = await page
    .locator(".github-summary strong")
    .first()
    .innerText();

  // Recharts/ghchart image blocked?
  out.chartOk = await page.locator(".contributions-image").evaluate((i) => ({
    complete: i.complete,
    naturalWidth: i.naturalWidth,
    naturalHeight: i.naturalHeight,
  }));

  return out;
}
