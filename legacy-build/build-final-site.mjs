import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const workspace = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(workspace, "PAN-San-Menaio-index-v3-1.html");
const outputPath = path.join(workspace, "PAN-San-Menaio-final", "index.html");
const logoAlt = "Logo PAN San Menaio, cocktail bar, beach club e ristorante";

let html = fs.readFileSync(sourcePath, "utf8");

function replaceOnce(needle, replacement, label) {
  const first = html.indexOf(needle);
  if (first < 0 || html.indexOf(needle, first + needle.length) >= 0) {
    throw new Error(`Sostituzione non univoca: ${label}`);
  }
  html = html.replace(needle, replacement);
}

function replaceRegexOnce(pattern, replacement, label) {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matches = [...html.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) {
    throw new Error(`Sostituzione ${label}: attese 1 corrispondenza, trovate ${matches.length}`);
  }
  html = html.replace(pattern, replacement);
}

replaceOnce(
  '  <link rel="canonical" href="https://www.example.com/">',
  '  <!-- Inserire il dominio ufficiale prima della pubblicazione per attivare il canonical URL. -->',
  "canonical placeholder",
);

replaceOnce(
  '    "url": "https://www.example.com/",\n',
  "",
  "structured-data placeholder URL",
);

replaceRegexOnce(
  /^  <meta property="og:image" content="data:image\/webp;base64,[^"]+">$/m,
  [
    '  <meta property="og:image" content="assets/images/logo-pan-san-menaio.png">',
    '  <meta property="og:image:type" content="image/png">',
    '  <meta property="og:image:width" content="1254">',
    '  <meta property="og:image:height" content="1254">',
    `  <meta property="og:image:alt" content="${logoAlt}">`,
    '  <meta name="twitter:image" content="assets/images/logo-pan-san-menaio.png">',
    `  <meta name="twitter:image:alt" content="${logoAlt}">`,
    '  <link rel="icon" type="image/png" href="assets/images/logo-pan-san-menaio.png">',
  ].join("\n"),
  "Open Graph image",
);

replaceOnce(
  "  </style>",
  `    /* Integrazione asset ufficiali e correzioni di robustezza */
    html, body { width: 100%; max-width: 100%; overflow-x: clip; }
    main, section, article, aside, form, nav, div { min-width: 0; }
    img, video { max-width: 100%; }

    .site-header {
      grid-template-columns: minmax(72px, auto) 1fr auto;
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .brand {
      display: block;
      width: 76px;
      height: 76px;
      flex: 0 0 auto;
    }
    .brand-logo,
    .hero-brand-logo,
    .footer-logo {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .site-header.is-scrolled .brand {
      width: 58px;
      height: 58px;
    }

    .hero {
      min-height: max(760px, 100svh);
    }
    .hero-media {
      background: var(--navy) url("assets/images/san-menaio/hero-video-poster.webp") center / cover no-repeat;
    }
    .hero-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .hero-copy {
      max-width: 720px;
    }
    .hero-brand {
      width: clamp(132px, 13vw, 188px);
      height: clamp(132px, 13vw, 188px);
      margin-bottom: clamp(20px, 3vh, 34px);
    }
    .hero h1 {
      max-width: 760px;
      font-size: clamp(3.6rem, 6.8vw, 7.6rem);
      overflow-wrap: normal;
    }

    .place-story-media img {
      object-position: center 47%;
    }
    .place-story-media,
    .contact-media {
      background: var(--navy);
    }
    .mission {
      grid-template-columns: minmax(0, 1.06fr) minmax(360px, .94fr);
      border-block: 1px solid var(--line);
    }
    .mission-media {
      position: relative;
      min-height: 530px;
      display: grid;
      place-items: center;
      padding: clamp(44px, 6vw, 90px);
      color: var(--white);
      background:
        radial-gradient(circle at 18% 18%, rgba(95,158,170,.38), transparent 28%),
        linear-gradient(145deg, #0d1d29, #153b49 72%, #0a202c);
      isolation: isolate;
    }
    .mission-media::before,
    .mission-media::after {
      content: "";
      position: absolute;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 50%;
      pointer-events: none;
    }
    .mission-media::before {
      width: min(70vw, 520px);
      aspect-ratio: 1;
      right: -18%;
      top: -24%;
    }
    .mission-media::after {
      width: min(48vw, 350px);
      aspect-ratio: 1;
      left: -8%;
      bottom: -30%;
    }
    .place-facts {
      position: relative;
      z-index: 1;
      width: min(100%, 520px);
    }
    .place-coordinate {
      margin: 0 0 42px;
      font-family: var(--serif);
      font-size: clamp(4.4rem, 7vw, 8rem);
      font-weight: 400;
      line-height: .82;
      letter-spacing: -.06em;
    }
    .place-coordinate span {
      display: block;
      margin-top: 18px;
      font-family: var(--sans);
      font-size: .68rem;
      font-weight: 700;
      line-height: 1.4;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: rgba(255,255,255,.62);
    }
    .place-fact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      background: rgba(255,255,255,.2);
      border: 1px solid rgba(255,255,255,.2);
    }
    .place-fact-grid div {
      padding: 18px 14px;
      background: rgba(8,23,34,.66);
    }
    .place-fact-grid strong,
    .place-fact-grid span { display: block; }
    .place-fact-grid strong {
      margin-bottom: 6px;
      font-family: var(--serif);
      font-size: 1.45rem;
      font-weight: 400;
    }
    .place-fact-grid span {
      font-size: .58rem;
      letter-spacing: .09em;
      text-transform: uppercase;
      color: rgba(255,255,255,.62);
    }

    .service-grid {
      gap: clamp(8px, 1vw, 16px);
      padding: clamp(8px, 1vw, 16px);
      background: var(--cream);
    }
    .service-card {
      min-height: clamp(500px, 58vw, 690px);
      border-radius: 3px;
    }
    .service-card::before {
      content: "";
      position: absolute;
      inset: 16px;
      z-index: 0;
      border: 1px solid rgba(255,255,255,.28);
      pointer-events: none;
    }
    .service-card-content {
      z-index: 1;
    }

    .gallery-section {
      padding: clamp(72px, 8vw, 110px) 0 64px;
      color: var(--white);
      background: #081722;
    }
    .gallery-slider {
      grid-auto-columns: minmax(320px, 48vw);
      gap: 12px;
      padding-inline: clamp(18px, 5vw, 72px);
    }
    .gallery-card {
      min-height: clamp(470px, 58vw, 720px);
      border-radius: 3px;
    }
    .gallery-card::before {
      content: "";
      position: absolute;
      inset: 16px;
      z-index: 1;
      border: 1px solid rgba(255,255,255,.22);
      pointer-events: none;
    }
    .slider-progress {
      background: rgba(255,255,255,.16);
    }
    .slider-progress span {
      background: var(--sand);
    }

    .contact-media {
      display: grid;
      align-items: end;
      background:
        radial-gradient(circle at 70% 30%, rgba(95,158,170,.52), transparent 23%),
        radial-gradient(circle at 30% 70%, rgba(167,101,61,.36), transparent 28%),
        repeating-radial-gradient(circle at 50% 50%, transparent 0 44px, rgba(255,255,255,.08) 45px 46px),
        #0d1d29;
    }
    .contact-media::before {
      content: "41°56' N  ·  15°57' E";
      position: absolute;
      top: 50%;
      left: 50%;
      width: max-content;
      transform: translate(-50%, -50%);
      font-family: var(--serif);
      font-size: clamp(2rem, 4vw, 5rem);
      letter-spacing: -.04em;
      color: rgba(255,255,255,.78);
    }
    .contact-media::after {
      background: linear-gradient(180deg, transparent 40%, rgba(4,14,21,.76));
    }

    .footer-brand {
      width: clamp(150px, 16vw, 220px);
      height: clamp(150px, 16vw, 220px);
      flex: 0 0 auto;
    }
    .mobile-menu {
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .gallery-card,
    .service-card,
    .mission-media,
    .place-story-media,
    .contact-media {
      contain: paint;
    }

    @media (max-width: 760px) {
      .site-header {
        grid-template-columns: 1fr auto;
        gap: 12px;
        padding: 10px 14px;
      }
      .brand {
        width: 60px;
        height: 60px;
      }
      .site-header.is-scrolled .brand {
        width: 52px;
        height: 52px;
      }
      .hero {
        min-height: max(760px, 100svh);
      }
      .hero-inner {
        padding-top: 112px;
        padding-bottom: 42px;
      }
      .hero-brand {
        width: 132px;
        height: 132px;
        margin-bottom: 18px;
      }
      .hero h1 {
        max-width: 100%;
        font-size: clamp(3rem, 14.5vw, 5.1rem);
        line-height: .93;
      }
      .hero p {
        max-width: 34rem;
        margin-block: 18px 22px;
      }
      .hero-links {
        gap: 16px;
      }
      .footer-brand {
        width: 164px;
        height: 164px;
      }
      .mission {
        grid-template-columns: 1fr;
      }
      .mission-media {
        min-height: 440px;
      }
      .place-fact-grid {
        grid-template-columns: 1fr;
      }
      .gallery-slider {
        grid-auto-columns: 84vw;
        padding-inline: 18px;
      }
    }

    @media (max-width: 520px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .booking-map {
        padding-inline: 10px;
      }
      .umbrella-grid {
        grid-template-columns: repeat(8, minmax(24px, 1fr));
        gap-inline: 3px;
      }
      .weather-head,
      .weather-footer {
        align-items: flex-start;
        flex-direction: column;
      }
      .gallery-head {
        align-items: flex-start;
      }
      .section-title,
      .booking-copy h2,
      .quote blockquote {
        overflow-wrap: anywhere;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-video { visibility: hidden; }
    }
  </style>`,
  "CSS closing tag",
);

replaceOnce(
  '    <a class="brand" href="#top" aria-label="PAN San Menaio, torna all\'inizio"><strong>PAN</strong><span>San Menaio</span></a>',
  `    <a class="brand" href="#top" aria-label="PAN San Menaio, torna all'inizio"><img class="brand-logo" src="assets/images/logo-pan-san-menaio.png" width="76" height="76" alt="${logoAlt}"></a>`,
  "header logo",
);

replaceRegexOnce(
  /^      <div class="hero-media"><img [^\n]+<\/div>$/m,
  `      <div class="hero-media">
        <video
          class="hero-video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="assets/images/san-menaio/hero-video-poster.webp"
          aria-hidden="true"
        >
          <source src="assets/video/videosanme.mp4" type="video/mp4">
        </video>
      </div>`,
  "hero media",
);

replaceOnce(
  '        <div class="hero-copy reveal">\n          <div class="hero-kicker">San Menaio · Gargano</div>',
  `        <div class="hero-copy reveal">
          <div class="hero-brand"><img class="hero-brand-logo" src="assets/images/logo-pan-san-menaio.png" width="188" height="188" alt="${logoAlt}"></div>
          <div class="hero-kicker">San Menaio · Gargano</div>`,
  "hero logo",
);

replaceRegexOnce(
  /<img src="data:image\/webp;base64,[^"]+" alt="San Menaio tra pineta, spiaggia e mare al tramonto" loading="lazy">/,
  `<div class="place-facts" aria-label="Coordinate e caratteristiche di San Menaio">
          <p class="place-coordinate">41°56' N<span>San Menaio · costa nord del Gargano</span></p>
          <div class="place-fact-grid"><div><strong>Adriatico</strong><span>Il mare</span></div><div><strong>Marzini</strong><span>La pineta</span></div><div><strong>Gargano</strong><span>Il territorio</span></div></div>
        </div>`,
  "mission place facts",
);

replaceRegexOnce(
  /<img src="data:image\/webp;base64,[^"]+" alt="San Menaio, costa e pineta sul Gargano" loading="lazy">/,
  '<img src="assets/images/san-menaio-tramonto.jpg" alt="Costa e pineta di San Menaio al tramonto" width="1530" height="2040" loading="lazy" decoding="async">',
  "place local image",
);

replaceRegexOnce(
  /<img src="data:image\/webp;base64,[^"]+" alt="Lungomare e spiaggia di San Menaio al tramonto" loading="lazy">/,
  "",
  "contact graphic panel",
);

replaceRegexOnce(
  /<img src="data:image\/webp;base64,[^"]+" alt="Spiaggia di San Menaio con ombrelloni e mare calmo" loading="lazy">/,
  '<img src="assets/images/san-menaio/spiaggia-est.webp" alt="Spiaggia est di San Menaio con ombrelloni e Monte Pucci sullo sfondo" width="1800" height="1350" loading="lazy" decoding="async">',
  "beach service image",
);

replaceRegexOnce(
  /<img src="data:image\/webp;base64,[^"]+" alt="Tavola mediterranea e cucina PAN" loading="lazy">/,
  '<img src="assets/images/san-menaio/piana-calenella.webp" alt="Piana di Calenella e costa di San Menaio viste dall’alto" width="1600" height="1200" loading="lazy" decoding="async">',
  "restaurant service image",
);

replaceRegexOnce(
  /<img src="data:image\/webp;base64,[^"]+" alt="Cocktail dorato PAN con agrumi e botaniche" loading="lazy">/,
  '<img src="assets/images/san-menaio/spiaggia-murge.webp" alt="Scogli e spiaggia delle Murge della Madonna a San Menaio" width="1080" height="720" loading="lazy" decoding="async">',
  "cocktail service image",
);

replaceRegexOnce(
  /<div class="gallery-slider" id="experienceSlider"[\s\S]*?<\/div>\n      <div class="slider-progress"/,
  `<div class="gallery-slider" id="experienceSlider" tabindex="0" aria-label="Galleria orizzontale di San Menaio">
        <figure class="gallery-card"><img src="assets/images/san-menaio/san-menaio-aerea.webp" alt="San Menaio e la sua spiaggia visti dall’aereo" width="756" height="447" loading="lazy" decoding="async"><figcaption>La costa di San Menaio</figcaption></figure>
        <figure class="gallery-card"><img src="assets/images/san-menaio/pineta-marzini-1.webp" alt="Luce tra i pini della Pineta Marzini di San Menaio" width="1024" height="768" loading="lazy" decoding="async"><figcaption>La Pineta Marzini</figcaption></figure>
        <figure class="gallery-card"><img src="assets/images/san-menaio/pineta-marzini-2.webp" alt="Pini monumentali della Pineta Marzini a San Menaio" width="1024" height="768" loading="lazy" decoding="async"><figcaption>Il verde sul mare</figcaption></figure>
      </div>
      <div class="slider-progress"`,
  "unique San Menaio gallery",
);

replaceOnce(
  '<p class="lead muted">I dati definitivi verranno inseriti quando saranno disponibili, invece di inventare numeri e orari come un sito turistico cresciuto senza supervisione.</p>',
  '<p class="lead muted">Contatti, indirizzo e orari ufficiali saranno pubblicati qui non appena definiti.</p>',
  "contact placeholder copy",
);

replaceOnce(
  '<footer class="site-footer"><div class="footer-top"><p class="footer-wordmark">PAN</p>',
  `<footer class="site-footer"><div class="footer-top"><div class="footer-brand"><img class="footer-logo" src="assets/images/logo-pan-san-menaio.png" width="220" height="220" alt="${logoAlt}"></div>`,
  "footer logo",
);

replaceOnce(
  '<a href="#">Cookie</a>',
  '<a href="#">Cookie</a><a href="credits.html">Crediti fotografici</a>',
  "photo credits link",
);

replaceOnce(
  "      const CONFIG = {",
  `      const heroVideo = document.querySelector('.hero-video');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const syncHeroVideo = () => {
        if (!heroVideo) return;
        heroVideo.muted = true;
        if (reducedMotion.matches) {
          heroVideo.pause();
        } else {
          heroVideo.play().catch(() => {});
        }
      };
      syncHeroVideo();
      reducedMotion.addEventListener?.('change', syncHeroVideo);

      const CONFIG = {`,
  "video reliability script",
);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, "utf8");
console.log(`Creato: ${outputPath}`);
