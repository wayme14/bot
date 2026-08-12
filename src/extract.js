const { chromium } = require("playwright");
const fs = require("fs");

const TARGET_URL =
  "https://stream.digitalbroadcast.id/lb0/8b2ccc69-a926-436b-bbc0-fb0822062ac4/index.fmp4.m3u8";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let lastM3U8 = null;

  page.on("request", (req) => {
    const url = req.url();

    if (url.includes(".m3u8")) {
      console.log("🎯 FOUND M3U8:", url);
      lastM3U8 = url; // نخزن آخر رابط فقط
    }
  });

  console.log("🚀 Opening page...");

  await page.goto(TARGET_URL, {
    waitUntil: "networkidle",
  });

  console.log("⏳ Waiting for stream...");

  await page.waitForTimeout(15000);

  console.log("\n===== FINAL RESULTS =====");

  if (!lastM3U8) {
    console.log("❌ No m3u8 found");
  } else {
    console.log("✅ FINAL M3U8:", lastM3U8);

    // 🟢 تحويله إلى ملف M3U
    fs.writeFileSync("latest.m3u8", lastM3U8);

    console.log("💾 Saved: latest.m3u8");
  }

  await browser.close();
})();
