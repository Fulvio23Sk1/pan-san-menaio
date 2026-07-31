import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const workspace = path.dirname(fileURLToPath(import.meta.url));
const videoPath = path.join(workspace, "videosanme.mp4");
const outputDir = path.join(
  workspace,
  "PAN-San-Menaio-final",
  "assets",
  "images",
  "san-menaio",
);
const videoSize = fs.statSync(videoPath).size;

const server = http.createServer((request, response) => {
  if (request.url === "/") {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end('<video id="source" muted playsinline preload="auto" src="/video.mp4"></video>');
    return;
  }
  if (request.url !== "/video.mp4") {
    response.writeHead(404);
    response.end();
    return;
  }
  const range = request.headers.range;
  if (!range) {
    response.writeHead(200, {
      "accept-ranges": "bytes",
      "content-length": videoSize,
      "content-type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(response);
    return;
  }
  const [startText, endText] = range.replace("bytes=", "").split("-");
  const start = Number(startText);
  const end = endText ? Number(endText) : videoSize - 1;
  response.writeHead(206, {
    "accept-ranges": "bytes",
    "content-length": end - start + 1,
    "content-range": `bytes ${start}-${end}/${videoSize}`,
    "content-type": "video/mp4",
  });
  fs.createReadStream(videoPath, { start, end }).pipe(response);
});

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => {
    const video = document.querySelector("video");
    return video && Number.isFinite(video.duration) && video.duration > 0;
  });
  const duration = await page.locator("#source").evaluate(video => video.duration);
  const frames = [
    [0.08, "hero-video-poster.webp"],
    [0.31, "video-frame-01.webp"],
    [0.57, "video-frame-02.webp"],
    [0.82, "video-frame-03.webp"],
  ];
  fs.mkdirSync(outputDir, { recursive: true });

  for (const [fraction, filename] of frames) {
    const dataUrl = await page.locator("#source").evaluate(
      async (video, time) => {
        video.currentTime = time;
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("seek timeout")), 10000);
          video.addEventListener(
            "seeked",
            () => {
              clearTimeout(timeout);
              resolve();
            },
            { once: true },
          );
        });
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        return canvas.toDataURL("image/webp", 0.9);
      },
      duration * fraction,
    );
    const bytes = Buffer.from(dataUrl.split(",")[1], "base64");
    fs.writeFileSync(path.join(outputDir, filename), bytes);
    console.log(`${filename}: ${Math.round(duration * fraction * 10) / 10}s`);
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
