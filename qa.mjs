0698660259export default async function run(page, ui) {
  const results = {};

  // 1. Loading screen must disappear after the 3s timer.
  await page.waitForTimeout(4000);
  results.loadingScreenVisible = await page
    .locator(".loading-screen")
    .isVisible()
    .catch(() => "absent");
  results.loadingScreenInDom = await page.locator(".loading-screen").count();

  // 2. Age timer ticking?
  const ageA = await page.locator(".age-timer").innerText();
  await page.waitForTimeout(1500);
  const ageB = await page.locator(".age-timer").innerText();
  results.ageTicks = ageA !== ageB;
  results.ageSample = ageB;

  // 3. GitHub summary state
  results.githubRepoCount = await page
    .locator(".github-summary strong")
    .first()
    .innerText();

  // 4. Contribution chart image actually loaded?
  results.contributionsImg = await page
    .locator(".contributions-image")
    .evaluate((img) => ({
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      src: img.currentSrc || img.src,
    }));

  // 5. Profile photo loaded?
  results.profileImg = await page
    .locator(".profile-page-image")
    .evaluate((img) => ({
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }));

  // 6. Horizontal overflow at mobile width?
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  results.mobile = {
    scrollWidth: await page.evaluate(
      () => document.documentElement.scrollWidth,
    ),
    clientWidth: await page.evaluate(
      () => document.documentElement.clientWidth,
    ),
  };

  // 7. Can the mobile menu be opened?
  const toggleVisible = await page.locator(".menu-toggle").isVisible();
  results.menuToggleVisibleAt390 = toggleVisible;
  if (toggleVisible) {
    await page.locator(".menu-toggle").click();
    await page.waitForTimeout(400);
    results.menuOpenAfterClick = await page
      .locator("header.nav nav")
      .evaluate((n) => n.classList.contains("open"));
  }

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.waitForTimeout(300);

  // 8. Contact form submit feedback
  await page.locator('input[placeholder="Your name"]').fill("Test User");
  await page
    .locator('input[placeholder="you@email.com"]')
    .fill("t@example.com");
  await page.locator("textarea").fill("Hello there");
  await page.locator("form button[type=submit]").click();
  await page.waitForTimeout(400);
  results.submitButtonText = await page
    .locator("form button[type=submit]")
    .innerText();

  // 9. Fonts loaded (index.css requests Manrope)
  results.manropeLoaded = await page.evaluate(() =>
    document.fonts.check('16px "Manrope"'),
  );

  return results;
}
