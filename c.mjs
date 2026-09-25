export default async function run(page, ui) {
  await page.waitForTimeout(4500);
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.waitForTimeout(600);

  // Sample actual rendered pixels from the contributions chart canvas
  out_chart: {
    const img = await page.locator(".contributions-image").boundingBox();
    if (!img) return { error: "no chart" };
    await page.screenshot({
      path: "c-chart.png",
      clip: { x: img.x, y: img.y, width: img.width, height: img.height },
    });
  }

  const btn = await page.locator(".lets-talk").boundingBox();
  await page.screenshot({
    path: "c-btn.png",
    clip: {
      x: Math.max(0, btn.x - 20),
      y: Math.max(0, btn.y - 20),
      width: btn.width + 40,
      height: btn.height + 40,
    },
  });

  return {
    buttonBg: await page
      .locator(".lets-talk")
      .evaluate((e) => getComputedStyle(e).backgroundImage.slice(0, 90)),
    buttonColor: await page
      .locator(".lets-talk")
      .evaluate((e) => getComputedStyle(e).color),
    chartFilter: await page
      .locator(".contributions-image")
      .evaluate((e) => getComputedStyle(e).filter),
    chartSrc: await page
      .locator(".contributions-image")
      .evaluate((e) => e.currentSrc || e.src),
    chartLoaded: await page
      .locator(".contributions-image")
      .evaluate((e) => ({ complete: e.complete, w: e.naturalWidth })),
  };
}
