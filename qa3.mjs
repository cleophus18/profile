export default async function run(page, ui) {
  const out = {};
  await page.waitForTimeout(4200); // let the loader finish

  out.spaceBgPresent = await page.locator(".space-bg").count();
  out.stars = await page.locator(".star").count();
  out.scrollProgressGone = await page.locator(".scroll-progress").count();

  out.letsTalk = await page.locator(".lets-talk").evaluate((a) => ({
    text: a.innerText.replace(/\s+/g, " ").trim(),
    href: a.getAttribute("href"),
  }));
  out.phoneLink = await page
    .locator(".hero-contact-alt .phone-link")
    .evaluate((a) => ({
      text: a.innerText,
      href: a.getAttribute("href"),
    }));

  out.skillGroups = await page.locator(".skill-group").count();
  out.skillCount = await page.locator(".skill-group li").count();
  out.skillTitles = await page.locator(".skill-group h4").allInnerTexts();

  out.contactPhone = await page.locator(".phone-number").evaluate((a) => ({
    text: a.innerText,
    href: a.getAttribute("href"),
  }));

  out.whatsapp = await page
    .locator('.contact-phone a[href*="wa.me"]')
    .getAttribute("href")
    .catch(() => null);

  out.footerPhone = await page
    .locator('footer a[href^="tel:"]')
    .evaluate((a) => ({ text: a.innerText, href: a.getAttribute("href") }));

  // Does the background actually move? Compare transforms over time.
  const t1 = await page
    .locator(".space-nebula")
    .evaluate((e) => getComputedStyle(e).transform);
  await page.waitForTimeout(1600);
  const t2 = await page
    .locator(".space-nebula")
    .evaluate((e) => getComputedStyle(e).transform);
  out.nebulaAnimating = t1 !== t2;
  out.gridAnimating = await page.locator(".space-grid").evaluate((e) => {
    const a = getComputedStyle(e).animationName;
    return a && a !== "none";
  });

  out.logo = await page.locator(".brand-mark").evaluate((i) => ({
    src: i.getAttribute("src"),
    w: i.naturalWidth,
  }));

  return out;
}
