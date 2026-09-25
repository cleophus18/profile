export default async function run(page, ui) {
  const out = {};
  await page.waitForTimeout(4200);

  for (const vp of [
    { name: "mobile-390", width: 390, height: 844 },
    { name: "tablet-768", width: 768, height: 1024 },
  ]) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(700);
    out[vp.name] = {
      scrollWidth: await page.evaluate(
        () => document.documentElement.scrollWidth,
      ),
      clientWidth: await page.evaluate(
        () => document.documentElement.clientWidth,
      ),
      overflowing: await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const bad = [];
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > vw + 1) {
            bad.push(
              (el.className && typeof el.className === "string"
                ? el.className
                : el.tagName
              ).slice(0, 40) + ` right=${Math.round(r.right)}`,
            );
          }
        }
        return bad.slice(0, 8);
      }),
    };
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `view-${vp.name}-hero.png` });

    await page.locator(".skills").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `view-${vp.name}-skills.png` });
  }

  return out;
}
