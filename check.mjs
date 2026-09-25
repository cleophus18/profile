export default async function run(page, ui) {
  const out = {};
  await page.waitForTimeout(4200);
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.waitForTimeout(500);

  // Is the motion actually happening?
  const snap = () =>
    page.evaluate(() => {
      const g = (s) => getComputedStyle(document.querySelector(s));
      const firstStar = document.querySelector(".star");
      return {
        nebula: g(".space-nebula").transform,
        grid: g(".space-grid").transform,
        orbitA: g(".orbit-a").transform,
        star: firstStar ? getComputedStyle(firstStar).transform : null,
      };
    });

  const t0 = await snap();
  await page.waitForTimeout(2500);
  const t1 = await snap();

  out.moves = {
    nebula: t0.nebula !== t1.nebula,
    grid: t0.grid !== t1.grid,
    orbitA: t0.orbitA !== t1.orbitA,
    stars: t0.star !== t1.star,
  };
  out.nebulaBefore = t0.nebula;
  out.nebulaAfter = t1.nebula;

  // Skill list check
  out.skills = await page.locator(".skill-group").evaluateAll((cards) =>
    cards.map((c) => ({
      group: c.querySelector("h4").innerText,
      items: [...c.querySelectorAll("li .skill-row span:first-child")].map(
        (s) => s.innerText,
      ),
    })),
  );

  // Logo back to the original PNG?
  out.logo = await page.locator(".brand-mark").evaluate((i) => ({
    src: i.getAttribute("src").slice(0, 60),
    w: i.naturalWidth,
    h: i.naturalHeight,
    renderedH: Math.round(i.getBoundingClientRect().height),
    renderedW: Math.round(i.getBoundingClientRect().width),
  }));

  return out;
}
