export default async function run(page, ui) {
  const out = {};
  await page.waitForTimeout(4200);

  out.title = await page.title();
  out.favicon = await page.locator('link[rel="icon"]').getAttribute("href");

  // Requested: no top bar on scroll
  out.scrollProgressElements = await page.locator(".scroll-progress").count();

  // Requested: moving space background
  out.stars = await page.locator(".star").count();
  const a = await page
    .locator(".space-nebula")
    .evaluate((e) => getComputedStyle(e).transform);
  await page.waitForTimeout(1500);
  const b = await page
    .locator(".space-nebula")
    .evaluate((e) => getComputedStyle(e).transform);
  out.backgroundMoves = a !== b;

  // Requested: Let's talk -> email
  out.letsTalkHref = await page.locator(".lets-talk").getAttribute("href");
  out.letsTalkHrefOk = out.letsTalkHref.startsWith(
    "mailto:cleotshinyaleni@gmail.com",
  );

  // Requested: phone everywhere
  const telLinks = await page.locator('a[href^="tel:"]').count();
  const telHrefs = await page
    .locator('a[href^="tel:"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
  out.telLinkCount = telLinks;
  out.telAllCorrect = telHrefs.every((h) => h === "tel:+27698660259");
  out.whatsapp = await page.locator('a[href*="wa.me"]').count();
  out.phoneVisibleCount = await page
    .getByText("069 866 0259", { exact: false })
    .count();

  // Requested: skills on page 2
  out.skillGroups = await page.locator(".skill-group").count();
  out.skillsInAbout = await page.locator("#about .skills").count();

  // Old logo fully replaced?
  out.oldLogoRefs = await page.evaluate(() =>
    document.documentElement.innerHTML.includes("CT TECH LOGO transparent"),
  );
  out.newLogoUsed = await page.locator(".brand-mark").count();

  // No console errors expected now
  out.mounted = await page.locator("section").count();
  out.scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  out.clientWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );

  return out;
}
