export default async function run(page, ui) {
  await page.waitForTimeout(4200);
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.waitForTimeout(400);

  const groups = page.locator(".skill-group");
  const n = await groups.count();
  const boxes = [];
  for (let i = 0; i < n; i += 1) {
    const b = await groups.nth(i).boundingBox();
    const listB = await groups.nth(i).locator("ul").boundingBox();
    boxes.push({
      title: (await groups.nth(i).locator("h4").innerText()).trim(),
      cardH: Math.round(b.height),
      listH: Math.round(listB.height),
      deadSpace: Math.round(b.height - listB.height - 80),
      x: Math.round(b.x),
      w: Math.round(b.width),
    });
  }

  const grid = await page.locator(".skill-grid").boundingBox();
  const heading = await page.locator(".skills-heading").boundingBox();
  const num = await page
    .locator(".skills-heading .section-number")
    .boundingBox();

  return {
    gridWidth: Math.round(grid.width),
    gridCols: await page
      .locator(".skill-grid")
      .evaluate((e) => getComputedStyle(e).gridTemplateColumns),
    headingBox: { x: Math.round(heading.x), w: Math.round(heading.width) },
    numberBox: {
      x: Math.round(num.x),
      y: Math.round(num.y),
      w: Math.round(num.width),
    },
    cards: boxes,
  };
}
