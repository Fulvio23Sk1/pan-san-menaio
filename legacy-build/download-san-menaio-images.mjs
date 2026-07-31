import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const workspace = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(
  workspace,
  "PAN-San-Menaio-final",
  "assets",
  "images",
  "san-menaio",
);

const images = [
  ["San Menaio aerea.jpg", "san-menaio-aerea.webp"],
  ["Spiaggia Est di San Menaio Large.jpg", "spiaggia-est.webp"],
  ["Spiaggia murgiamadonna San Menaio.jpg", "spiaggia-murge.webp"],
  ["San Menaio e la Piana di Calenella.jpg", "piana-calenella.webp"],
  ["San Menaio Pineta Marzini1.jpg", "pineta-marzini-1.webp"],
  ["San Menaio Pineta Marzini2.jpg", "pineta-marzini-2.webp"],
];

fs.mkdirSync(outputDir, { recursive: true });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function resolveSource(title) {
  if (title === "San Menaio Pineta Marzini2.jpg") {
    const endpoint =
      "https://www.flickr.com/services/oembed/?url=" +
      encodeURIComponent("https://www.flickr.com/photos/codicillo/407856642/") +
      "&format=json";
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`Flickr oEmbed: HTTP ${response.status}`);
    return (await response.json()).url;
  }
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(title)}`;
}

for (const [title, filename] of images) {
  const destination = path.join(outputDir, filename);
  if (fs.existsSync(destination)) {
    console.log(`${filename}: già presente`);
    continue;
  }
  const source = await resolveSource(title);
  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(source, {
      redirect: "follow",
      headers: {
        "user-agent": "Codex-PAN-San-Menaio/1.0 (local website asset preparation)",
      },
    });
    if (response.status !== 429 || attempt === 4) break;
    await wait(attempt * 4000);
  }
  if (!response.ok) {
    throw new Error(`${title}: HTTP ${response.status}`);
  }
  const input = Buffer.from(await response.arrayBuffer());
  await sharp(input)
    .rotate()
    .resize({
      width: 1800,
      height: 1400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 5 })
    .toFile(destination);
  console.log(`${title} -> ${filename}`);
  await wait(1200);
}
