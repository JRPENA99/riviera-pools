// Static site generator for the Riviera Custom Pools concept.
// Run: node build.mjs  → writes HTML pages into ./docs (served by GitHub Pages).
import { writeFileSync } from "node:fs";

const OUT = new URL("./docs/", import.meta.url);
const PHONE = "832-722-5817";
const TEL = "tel:+18327225817";
const ADDRESS = ["6305 Oban St, Bldg 2", "Houston, TX 77085"];
const AREAS = ["Houston", "West University Place", "Bellaire", "Katy", "Cypress", "The Woodlands", "Spring", "Pearland", "Manvel", "Friendswood", "Pasadena", "Sugar Land", "First Colony", "Missouri City", "League City"];

// ---------- images ----------
// "s:" = high-resolution representative photography (Unsplash), "r:" = Riviera's own project photos
function src(key) {
  const [kind, name] = key.split(":");
  if (kind === "s") return { src: `img/${name}-m.jpg`, srcset: `img/${name}-m.jpg 1200w, img/${name}-l.jpg 2400w`, rep: true };
  return { src: `img/riviera/${name}.jpg`, srcset: "", rep: false };
}
function img(key, alt, { sizes = "100vw", eager = false, pos = "" } = {}) {
  const s = src(key);
  return `<img src="${s.src}"${s.srcset ? ` srcset="${s.srcset}" sizes="${sizes}"` : ""} alt="${alt}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${pos ? ` style="object-position:${pos}"` : ""}>`;
}
const repTag = (key) => (src(key).rep ? `<span class="tag">Representative imagery</span>` : "");

const arrow = `<span class="arr" aria-hidden="true"></span>`;
const lines = (...ls) => ls.map((l) => `<span class="line-mask"><span>${l}</span></span>`).join("");

// ---------- projects ----------
const projects = [
  { slug: "rooftop-amenity-pool", title: "Rooftop Amenity Pool", cat: "commercial", kind: "Hospitality", img: "s:skyline", size: "p-xl",
    features: ["Vanishing edge", "Skyline views", "Open lounge deck"],
    overview: "An elevated amenity pool where the waterline meets the skyline — a vanishing edge, an open lounge deck and finishes chosen to hold up to daily guest use.",
    gallery: ["s:lap", "s:rooftop", "s:night-resort"] },
  { slug: "waterfront-loggia-pool", title: "Waterfront Loggia Pool", cat: "residential", kind: "Geometric pool", img: "r:geometric-3", size: "p-m",
    features: ["Geometric pool", "Covered loggia", "Stone decking"],
    overview: "A geometric pool set between a covered loggia and the water beyond — clean lines that extend the architecture of the home out into the view.",
    gallery: ["r:geometric-2", "r:geometric-5", "r:geometric-7"] },
  { slug: "estate-pool-pavilion", title: "Estate Pool & Pavilion", cat: "residential", kind: "Geometric pool", img: "r:geometric-2", size: "p-m",
    features: ["Formal geometric pool", "Pool pavilion", "Stone decking"],
    overview: "A formal, symmetrical pool aligned to the rear of the residence, anchored by a pavilion and finished with stone decking.",
    gallery: ["r:geometric-3", "r:geometric-8", "r:geometric-1"] },
  { slug: "hotel-courtyard-pool", title: "Hotel Courtyard Pool", cat: "commercial", kind: "Hotel", img: "s:night-resort", size: "p-l",
    features: ["Feature lighting", "Free-form shape", "Generous deck space"],
    overview: "A hospitality pool designed to perform after dark — feature lighting, generous deck space and finishes built for heavy daily use.",
    gallery: ["s:palms", "s:skyline", "s:sunset-resort"] },
  { slug: "sunset-pool-terrace", title: "Sunset Pool Terrace", cat: "commercial", kind: "Multifamily amenity", img: "s:rooftop", size: "p-s",
    features: ["Lounge terrace", "Shade structures", "Amenity deck"],
    overview: "An amenity terrace organised around the water — lounge seating, shade and a deck sized for residents and their guests.",
    gallery: ["s:lap", "s:night-villa", "s:palms"] },
  { slug: "water-wall-terrace", title: "Water Wall Terrace", cat: "residential", kind: "Water features", img: "r:geometric-5", size: "p-m",
    features: ["Raised water wall", "Sheer descents", "Palm terrace"],
    overview: "A raised water wall with sheer descents brings sound and movement to a terrace pool framed by palms.",
    gallery: ["r:geometric-4", "r:geometric-3", "r:geometric-9"] },
  { slug: "natural-stone-spa", title: "Natural Stone Spa", cat: "residential", kind: "Spa & waterfall", img: "r:custom-6", size: "p-m",
    features: ["Raised spa", "Natural stone waterfall", "Mosaic tile"],
    overview: "A raised spa wrapped in natural stone, spilling into the pool below with a waterfall built by hand.",
    gallery: ["r:custom-7", "r:custom-9", "r:custom-1"] },
  { slug: "resort-lap-pool", title: "Resort Lap Pool", cat: "commercial", kind: "Hospitality", img: "s:lap", size: "p-xl",
    features: ["Long-format pool", "Lounge deck", "Landscape integration"],
    overview: "A long-format pool that works for both laps and lounging, set into the landscape with a continuous lounge deck.",
    gallery: ["s:skyline", "s:night-resort", "s:rooftop"] },
  { slug: "poolside-bar-pavilion", title: "Poolside Bar Pavilion", cat: "residential", kind: "Outdoor living", img: "r:geometric-6", size: "p-m",
    features: ["Outdoor bar", "Covered pavilion", "Stone deck"],
    overview: "A covered bar pavilion steps from the water, turning the pool into the centre of outdoor entertaining.",
    gallery: ["r:geometric-2", "r:geometric-1", "r:geometric-3"] },
  { slug: "courtyard-water-features", title: "Courtyard Water Features", cat: "residential", kind: "Water features", img: "r:geometric-4", size: "p-m",
    features: ["Feature wall", "Sheer descents", "Geometric pool"],
    overview: "A crisp white feature wall with sheer descents gives a courtyard pool a strong architectural focal point.",
    gallery: ["r:geometric-5", "r:geometric-8", "r:geometric-7"] },
  { slug: "grotto-waterfall-pool", title: "Grotto & Waterfall Pool", cat: "residential", kind: "Free-form pool", img: "r:custom-7", size: "p-m",
    features: ["Free-form pool", "Rock waterfall", "Grotto"],
    overview: "A lagoon-style free-form pool with natural rock, a grotto and a waterfall set into dense planting.",
    gallery: ["r:custom-9", "r:custom-6", "r:custom-5"] },
  { slug: "sun-shelf-pool", title: "Sun Shelf Pool", cat: "residential", kind: "Geometric pool", img: "r:geometric-1", size: "p-m",
    features: ["Sun shelf with loungers", "Bubblers", "Geometric pool"],
    overview: "A shallow sun shelf with in-water loungers and bubblers extends a geometric pool toward the lawn.",
    gallery: ["r:geometric-7", "r:geometric-8", "r:geometric-2"] },
  { slug: "palm-court-pool", title: "Palm Court Pool", cat: "commercial", kind: "Hotel", img: "s:palms", size: "p-m",
    features: ["Resort deck", "Palm landscape", "Evening lighting"],
    overview: "A resort-style hotel pool framed by palms, with a lounge deck and lighting that carries the space into the evening.",
    gallery: ["s:night-resort", "s:sunset-resort", "s:lap"] },
  { slug: "free-form-lagoon", title: "Free-Form Lagoon", cat: "residential", kind: "Free-form pool", img: "r:custom-5", size: "p-m",
    features: ["Free-form pool", "Rock features", "Attached spa"],
    overview: "A free-form lagoon pool with natural rock features, shaped to fit the curves of the yard.",
    gallery: ["r:custom-7", "r:custom-3", "r:custom-8"] },
];
const P = Object.fromEntries(projects.map((p) => [p.slug, p]));
const purl = (p) => `project-${p.slug}.html`;
const catLabel = (c) => (c === "commercial" ? "Commercial" : "Residential");

// ---------- layout ----------
const NAV = [
  ["commercial.html", "Commercial"],
  ["residential.html", "Residential"],
  ["projects.html", "Projects"],
  ["about.html", "About"],
];

function layout({ title, desc, page, body, lightNav = false }) {
  const links = NAV.map(([h, l]) => `<a href="${h}"${page === h ? ' aria-current="page"' : ""}>${l}</a>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#10100f">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2310100f'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' font-family='Georgia,serif' font-size='40' fill='%23ece7de'%3ER%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/site.css">
<script>document.documentElement.classList.add("js")</script>
</head>
<body class="${lightNav ? "light-nav" : ""}">
<a class="skip" href="#main" style="position:absolute;left:-9999px">Skip to content</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Riviera Custom Pools — home"><span class="word">Riviera</span><span class="sub">Custom Pools</span></a>
    <nav class="nav-links" aria-label="Primary">
      ${links}
      <a class="nav-phone" href="${TEL}">${PHONE}</a>
      <a class="btn" href="contact.html">Start a Project</a>
    </nav>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu">
  <ol>
    <li><a href="index.html"><small>01</small>Home</a></li>
    ${NAV.map(([h, l], i) => `<li><a href="${h}"><small>0${i + 2}</small>${l}</a></li>`).join("")}
    <li><a href="contact.html"><small>06</small>Contact</a></li>
  </ol>
  <div class="mm-foot">
    <a class="btn light solid" href="contact.html">Start a Project ${arrow}</a>
    <p><a href="${TEL}">${PHONE}</a> &nbsp;·&nbsp; Houston, Texas</p>
  </div>
</div>
<main id="main">
${body}
</main>
${footer()}
<script src="assets/site.js" defer></script>
</body>
</html>
`;
}

function footer() {
  return `<footer class="footer">
  <div class="wrap">
    <div class="top">
      <div class="big"><div class="word">Riviera</div><div class="sub">Custom Pools · Houston · Est. 2004</div></div>
      <div class="col"><h4>Explore</h4><a href="commercial.html">Commercial</a><a href="residential.html">Residential</a><a href="projects.html">Projects</a><a href="about.html">About</a><a href="contact.html">Contact</a></div>
      <div class="col"><h4>Build</h4><a href="residential.html#geometric">Geometric Pools</a><a href="residential.html#free-form">Free-Form Pools</a><a href="residential.html#spas">Spas & Water Features</a><a href="residential.html#outdoor">Outdoor Living</a><a href="residential.html#remodel">Remodeling</a></div>
      <div class="col"><h4>Studio</h4><p>${ADDRESS[0]}<br>${ADDRESS[1]}</p><a href="${TEL}">${PHONE}</a><a href="contact.html">Request a free estimate</a></div>
    </div>
    <div class="areas"><b>Serving</b>${AREAS.join(" · ")}</div>
    <div class="bottom"><span>© 2026 Riviera Custom Pools. All rights reserved.</span><span>Concept design · Some photography is representative</span></div>
  </div>
</footer>`;
}

function card(p, cls, i, sizes = "(max-width: 860px) 100vw, 60vw") {
  return `<a class="card ${cls}" href="${purl(p)}" data-cat="${p.cat}">
    <div class="media rv-img">${img(p.img, p.title, { sizes })}${repTag(p.img)}</div>
    <div class="meta rv">
      <div>${i ? `<span class="num">${i}</span>` : ""}<h3>${p.title}</h3></div>
      <span class="k">${catLabel(p.cat)} · ${p.kind} <span class="arrow" aria-hidden="true"></span></span>
    </div>
  </a>`;
}

const testimonials = [
  ["You stood by the price after the contract was signed, and no one tried to sell us features that we didn't want. The work was done professionally and on time.", "Susie S. Bateman — The Woodlands, Texas"],
  ["Every crew was very professional and cleaned up after each phase of construction. You took the time to listen and designed exactly what I wanted.", "Santana Nievez — Bellaire, Texas"],
  ["Our designer was wonderful. He made our choices very easy and no one pressured us. Luis kept modifying our design until we were completely satisfied.", "Abdi Niakian — Clear Lake, Texas"],
];
const quotes = (cls = "") => `<section class="pad ${cls}">
  <div class="wrap quote" data-quotes>
    <span class="eyebrow rv">Clients</span>
    <div style="grid-column: 3 / span 9">
      ${testimonials.map(([q, c], i) => `<blockquote class="qslide${i === 0 ? " on" : ""}"><p>${q}</p><cite>${c}</cite></blockquote>`).join("")}
    </div>
    <div class="quotes-nav">${testimonials.map((_, i) => `<button aria-label="Testimonial ${i + 1}"${i === 0 ? ' class="on"' : ""}></button>`).join("")}</div>
  </div>
</section>`;

const phases = [
  ["Excavation & Steel", "The pool is excavated, formed and reinforced with a steel rebar cage built to your design."],
  ["Plumbing & Electrical", "Lines, equipment, lighting and automation are set before the shell is placed."],
  ["Gunite", "The structural shell is shot in gunite — any shape, any size the site allows."],
  ["Tile & Coping", "Waterline tile and coping define the finish: stone, glass, mosaic and accent tile."],
  ["Plaster", "The interior finish is applied and the pool is filled for the first time."],
  ["Clean Up", "Every phase is cleaned up as we go — the site is handed back ready to swim."],
];
const processSteps = (light = false) => `<div class="process${light ? " light-proc" : ""}">
  ${phases.map(([t, d], i) => `<div class="step rv${i % 3 ? ` rv-d${i % 3}` : ""}"><span class="dot"></span><div class="no">0${i + 1}</div><div><h3>${t}</h3><p>${d}</p></div></div>`).join("")}
</div>`;

const cta = ({ title = "Let&rsquo;s build <em>what&rsquo;s next.</em>", text = "Tell us about your property — a hotel, an apartment community or your own backyard. Every project begins with a free estimate.", image = "s:res-dusk" } = {}) => `<section class="cta">
  <div class="media">${img(image, "", { sizes: "100vw" })}</div>
  <div class="wrap inner">
    <span class="eyebrow plain rv">Start a project</span>
    <h2 class="rv">${title}</h2>
    <p class="rv rv-d1">${text}</p>
    <div class="ctas rv rv-d2">
      <a class="btn light solid" href="contact.html?type=hospitality">Commercial Inquiry ${arrow}</a>
      <a class="btn light" href="contact.html?type=residential">Residential Consultation ${arrow}</a>
    </div>
    <a class="phone rv rv-d3" href="${TEL}">${PHONE}</a>
  </div>
</section>`;

// ---------- pages ----------
const pages = {};

pages["index.html"] = layout({
  title: "Riviera Custom Pools — Commercial & Custom Pools, Houston",
  desc: "Riviera Custom Pools builds pools for hotels, apartment communities and Houston's finest homes. Established 2004.",
  page: "index.html",
  body: `
<section class="hero">
  <div class="bg">${img("s:skyline", "Rooftop pool with a vanishing edge overlooking a city skyline", { eager: true })}</div>
  <div class="content">
    <div class="wrap">
      <div>
        <span class="eyebrow rv">Riviera Custom Pools · Houston, Texas</span>
        <h1 class="display">${lines("Pools built to a", "<em>hospitality</em>", "standard.")}</h1>
      </div>
      <div class="side rv rv-d2">
        <p>Commercial and custom pools for hotels, apartment communities and Houston&rsquo;s finest homes — designed and built by one team since 2004.</p>
        <div class="ctas">
          <a class="btn light solid" href="projects.html">View Our Work ${arrow}</a>
          <a class="btn light" href="contact.html">Start a Project</a>
        </div>
      </div>
    </div>
  </div>
  <div class="scroll-cue" aria-hidden="true">Scroll</div>
  <div class="credit">Representative imagery</div>
</section>

<section class="pad">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">Selected Work</span><h2 class="h1">${lines("Built for the places", "people <em>gather.</em>")}</h2></div>
      <div class="a rv rv-d1"><p>Hotel courtyards, amenity decks and private residences across Greater Houston.</p><a class="link" href="projects.html">All projects ${arrow}</a></div>
    </div>
    <div class="work-grid">
      ${card(P["hotel-courtyard-pool"], "w-a", "01", "(max-width: 860px) 100vw, 58vw")}
      ${card(P["waterfront-loggia-pool"], "w-b", "02", "(max-width: 860px) 84vw, 34vw")}
      ${card(P["resort-lap-pool"], "w-c", "03", "(max-width: 860px) 100vw, 84vw")}
    </div>
  </div>
</section>

<section class="pad tint">
  <div class="wrap intro">
    <span class="eyebrow rv">About Riviera</span>
    <p class="statement rv">Since 2004, Riviera has built pools for Houston&rsquo;s hotels, apartment communities and private estates — <span class="muted">with a fixed price, a clear timeline and the workmanship to stand behind both.</span></p>
    <div class="facts">
      <div class="fact rv"><div class="v">2004</div><div class="l">Established in Houston by founder Luis Ramirez.</div></div>
      <div class="fact rv rv-d1"><div class="v">20<span class="accent">+</span></div><div class="l">Years of pool construction experience behind every project.</div></div>
      <div class="fact rv rv-d2"><div class="v">99<span class="accent">%</span></div><div class="l">Of projects completed on time and under budget, weather permitting.</div></div>
    </div>
  </div>
</section>

<section class="sectors">
  <a class="sector" href="commercial.html">
    <div class="media">${img("s:palms", "Resort hotel pool framed by palms at dusk", { sizes: "(max-width: 860px) 100vw, 50vw" })}</div>
    <span class="tag">Representative imagery</span>
    <div class="in-c">
      <div class="top"><span>01</span><span>For owners & developers</span></div>
      <h2>Commercial</h2>
      <ul><li>Hotels & resorts</li><li>High-end hospitality</li><li>Apartment communities</li></ul>
      <span class="link">Explore commercial ${arrow}</span>
    </div>
  </a>
  <a class="sector" href="residential.html">
    <div class="media">${img("s:res-white", "Modern white residence with a geometric pool", { sizes: "(max-width: 860px) 100vw, 50vw" })}</div>
    <span class="tag">Representative imagery</span>
    <div class="in-c">
      <div class="top"><span>02</span><span>For homeowners</span></div>
      <h2>Residential</h2>
      <ul><li>Custom pools</li><li>Spas & water features</li><li>Outdoor living</li><li>Remodeling</li></ul>
      <span class="link">Explore residential ${arrow}</span>
    </div>
  </a>
</section>

<section class="pad dark">
  <div class="wrap services">
    <div class="stick">
      <span class="eyebrow">Capabilities</span>
      <h2 class="h2" style="margin-top:22px">What we build</h2>
      <div class="frame">
        ${img("s:lap", "Long resort lap pool", { sizes: "(max-width: 860px) 100vw, 40vw" })}
        ${img("s:res-modern", "Contemporary geometric pool", { sizes: "(max-width: 860px) 100vw, 40vw" })}
        ${img("s:res-garden", "Garden pool", { sizes: "(max-width: 860px) 100vw, 40vw" })}
        ${img("s:night-villa", "Pool and spa at night", { sizes: "(max-width: 860px) 100vw, 40vw" })}
        ${img("s:rooftop", "Pool terrace with shade structures", { sizes: "(max-width: 860px) 100vw, 40vw" })}
        ${img("s:res-court", "Renovated courtyard pool", { sizes: "(max-width: 860px) 100vw, 40vw" })}
        ${img("s:night-resort", "Pool with evening lighting", { sizes: "(max-width: 860px) 100vw, 40vw" })}
      </div>
    </div>
    <ol>
      ${[
        ["commercial.html", "Commercial Pools", "Pools and amenity decks for hotels, high-end hospitality and apartment communities."],
        ["residential.html#geometric", "Geometric Pools", "Clean lines that complement the architecture — ideal for laps, recreation and a more refined feel."],
        ["residential.html#free-form", "Free-Form Pools", "Lagoon-style pools with natural stone waterfalls, grottos, jump rocks and slides."],
        ["residential.html#spas", "Spas & Water Features", "Spas, water walls, sheer descents, stone waterfalls and fire features."],
        ["residential.html#outdoor", "Outdoor Living", "Gazebos, pergolas, patios, sundecks, stamped concrete and fire pits."],
        ["residential.html#remodel", "Remodeling", "Resurfacing, tile and coping, deck repair, reshaping, salt systems and equipment upgrades."],
        ["residential.html#lighting", "Lighting & Smart Control", "LED pool and landscape lighting, with automation controlled from a single touch."],
      ].map(([h, t, d], i) => `<li><a href="${h}"><span class="n">0${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div><span class="go" aria-hidden="true"></span></a></li>`).join("")}
    </ol>
  </div>
</section>

<section class="feature">
  <div class="media">${img("s:night-resort", "Hotel courtyard pool lit at dusk", { sizes: "100vw" })}</div>
  <div class="box">
    <div class="wrap">
      <div class="inner">
        <span class="eyebrow rv">Featured · Hospitality</span>
        <h2 class="h1 rv">Hotel Courtyard Pool</h2>
        <p class="rv rv-d1">A hospitality pool designed to perform after dark — feature lighting, generous deck space and finishes built for daily guest use.</p>
        <div class="specs rv rv-d2"><div><span>Sector</span>Hospitality</div><div><span>Scope</span>Pool · Deck · Lighting</div><div><span>Imagery</span>Representative</div></div>
        <a class="link rv rv-d3" href="${purl(P["hotel-courtyard-pool"])}">View project ${arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="pad">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">Why Riviera</span><h2 class="h1">${lines("A builder that", "keeps its <em>word.</em>")}</h2></div>
      <div class="a rv rv-d1"><p>The industry is known for delays and price increases after work begins. We built our name on the opposite.</p></div>
    </div>
    <div class="why">
      <div class="rv"><span class="n">01</span><h3>Fixed price</h3><p>An easy-to-understand proposal and a fixed price — no increases after the contract is signed.</p></div>
      <div class="rv rv-d1"><span class="n">02</span><h3>A clear timeline</h3><p>A construction schedule set up front. Weather permitting, 99% of projects finish on time and under budget.</p></div>
      <div class="rv rv-d2"><span class="n">03</span><h3>Proven craft</h3><p>Two decades in Houston pool construction, including more than ten years alongside JR Pool Plastering and Texas Gunite.</p></div>
      <div class="rv rv-d3"><span class="n">04</span><h3>Start to finish</h3><p>Forming and steel through plumbing, tile, coping and deck work — the entire build, managed by one team.</p></div>
    </div>
  </div>
</section>

<section class="pad dark">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">The Process</span><h2 class="h1">${lines("Six phases.", "<em>One schedule.</em>")}</h2></div>
      <div class="a rv rv-d1"><p>Every project begins with a design consultation and a fixed proposal. Construction then moves through six defined phases.</p><a class="link" href="about.html#process">How we work ${arrow}</a></div>
    </div>
    ${processSteps()}
  </div>
</section>

<section class="pad">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">From the Portfolio</span><h2 class="h1">${lines("Riviera work,", "<em>in detail.</em>")}</h2></div>
      <div class="a rv rv-d1"><p>Residential projects photographed by Riviera — stone, water and finish up close.</p><a class="link" href="projects.html?filter=residential">Residential work ${arrow}</a></div>
    </div>
    <div class="gallery">
      <figure class="g1"><a href="${purl(P["natural-stone-spa"])}"><div class="media rv-img">${img("r:custom-6", "Raised natural stone spa", { pos: "60% 50%" })}</div></a><figcaption class="rv"><span>Natural Stone Spa</span><span>01</span></figcaption></figure>
      <figure class="g2"><a href="${purl(P["water-wall-terrace"])}"><div class="media rv-img">${img("r:geometric-5", "Water wall terrace pool", { pos: "55% 50%" })}</div></a><figcaption class="rv"><span>Water Wall Terrace</span><span>02</span></figcaption></figure>
      <figure class="g3"><a href="${purl(P["poolside-bar-pavilion"])}"><div class="media rv-img">${img("r:geometric-6", "Poolside bar pavilion", { pos: "40% 50%" })}</div></a><figcaption class="rv"><span>Poolside Bar Pavilion</span><span>03</span></figcaption></figure>
    </div>
  </div>
</section>

${quotes("tint")}
${cta()}`,
});

pages["commercial.html"] = layout({
  title: "Commercial Pools — Hotels, Hospitality & Multifamily | Riviera Custom Pools",
  desc: "Commercial pools and amenity spaces for hotels, high-end hospitality and apartment communities across Greater Houston.",
  page: "commercial.html",
  body: `
<section class="page-hero hero">
  <div class="bg">${img("s:lap", "Long resort pool with lounge deck", { eager: true })}</div>
  <div class="content"><div class="wrap">
    <div><span class="eyebrow rv">Commercial</span><h1 class="h1">${lines("Pools for hotels,", "hospitality &", "<em>multifamily.</em>")}</h1></div>
    <p class="side rv rv-d2">Riviera builds pools and amenity spaces for hotels, high-end hospitality properties and apartment communities across Greater Houston.</p>
  </div></div>
  <div class="credit">Representative imagery</div>
</section>

<section class="pad">
  <div class="wrap intro">
    <span class="eyebrow rv">The brief</span>
    <p class="statement rv">A commercial pool is judged twice — <span class="muted">by the guests and residents who use it every day, and by the owners who need it delivered on schedule and on budget.</span></p>
  </div>
</section>

<section class="pad" style="padding-top:0">
  <div class="wrap">
    <div class="split l">
      <div class="media rv-img">${img("s:night-resort", "Hotel pool with evening lighting", { sizes: "(max-width: 860px) 100vw, 58vw" })}<span class="tag">Representative imagery</span></div>
      <div class="tx rv"><span class="eyebrow">01 · Hotels & Resorts</span><h2 class="h3">Pools that set the tone of a property.</h2><p>Courtyard pools and resort-style decks designed for heavy daily use — with lighting that carries the space into the evening.</p>
        <ul class="checks"><li>Courtyard & resort pools</li><li>Spas and water features</li><li>LED feature lighting</li><li>Pool decks, tile & coping</li></ul></div>
    </div>
    <div class="split r">
      <div class="media rv-img">${img("s:skyline", "Rooftop pool overlooking a skyline", { sizes: "(max-width: 860px) 100vw, 58vw" })}<span class="tag">Representative imagery</span></div>
      <div class="tx rv"><span class="eyebrow">02 · High-End Hospitality</span><h2 class="h3">Where the pool is part of the brand.</h2><p>For boutique and luxury properties: premium stone, glass and mosaic tile, detailed to match the architecture and interiors.</p>
        <ul class="checks"><li>Premium tile & stone selections</li><li>Vanishing edges & water walls</li><li>Fire and water features</li><li>Smart control & automation</li></ul></div>
    </div>
    <div class="split l">
      <div class="media rv-img">${img("s:rooftop", "Amenity pool terrace with shade", { sizes: "(max-width: 860px) 100vw, 58vw" })}<span class="tag">Representative imagery</span></div>
      <div class="tx rv"><span class="eyebrow">03 · Multifamily & Apartments</span><h2 class="h3">Amenity pools that work as hard as the building.</h2><p>Durable finishes, efficient equipment and automation that keeps daily operation simple for property management.</p>
        <ul class="checks"><li>Amenity pools & sundecks</li><li>Salt & chlorine sanitation</li><li>Energy-efficient equipment</li><li>Remodeling of existing pools</li></ul></div>
    </div>
  </div>
</section>

<section class="pad dark">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">Working with Riviera</span><h2 class="h1">${lines("Built for owners,", "developers & <em>GCs.</em>")}</h2></div>
    </div>
    <div class="cols">
      <div class="rv"><span class="n">01</span><h3>Transparent pricing</h3><p>A clear proposal and a fixed price, so the pool package doesn&rsquo;t move once the budget is set.</p></div>
      <div class="rv rv-d1"><span class="n">02</span><h3>A schedule you can plan around</h3><p>A construction schedule set up front and coordinated with the wider project. Weather permitting, 99% of our projects finish on time.</p></div>
      <div class="rv rv-d2"><span class="n">03</span><h3>The full scope, one team</h3><p>From forming and steel through plumbing, electrical, gunite, tile, coping, plaster and deck work.</p></div>
    </div>
  </div>
</section>

<section class="pad">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">Commercial Work</span><h2 class="h1">${lines("Selected <em>projects.</em>")}</h2></div>
      <div class="a rv"><a class="link" href="projects.html?filter=commercial">All commercial ${arrow}</a></div>
    </div>
    <div class="work-grid">
      ${card(P["rooftop-amenity-pool"], "w-a", "01", "(max-width: 860px) 100vw, 58vw")}
      ${card(P["sunset-pool-terrace"], "w-b", "02", "(max-width: 860px) 84vw, 34vw")}
    </div>
  </div>
</section>

<section class="pad tint">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">Construction</span><h2 class="h1">${lines("Six phases, <em>clearly</em>", "managed.")}</h2></div>
    </div>
    ${processSteps(true)}
  </div>
</section>

${cta({ title: "Planning a <em>commercial</em> pool?", text: "Share your project — hotel, hospitality or multifamily — and we&rsquo;ll respond with next steps and a free estimate.", image: "s:sunset-resort" })}`,
});

const resSections = [
  ["geometric", "Geometric Pools", "Classic lines, designed around the house.", "Geometric pools feature even lines and clean shapes that complement your home&rsquo;s architecture and give it a more luxurious feel. They maximise space — ideal for laps and recreation — and can incorporate rock slides, water walls and fire features.", ["Lap & recreation layouts", "Sun shelves & bubblers", "Water walls & fire features"], "s:res-modern"],
  ["free-form", "Free-Form Pools", "Natural curves, built in stone.", "Free-form pools trade hard angles for curves — lagoon-style designs with rock features, waterfalls and stone decking. Popular across Texas for recreation and entertaining, they can add grottos, jump rocks or a natural waterfall slide.", ["Lagoon-style designs", "Grottos & jump rocks", "Natural waterfall slides"], "s:res-garden"],
  ["spas", "Spas & Water Features", "Sound, movement and warmth.", "Spas, waterfalls, sheer descents, water walls and fountains — built to be the focal point of the yard or a quiet place to end the day.", ["Raised & integrated spas", "Natural stone waterfalls", "Sheer descents & fountains"], "s:night-villa"],
  ["outdoor", "Outdoor Living", "The space around the water.", "Gazebos, pergolas, outdoor patios, stamped concrete, sundecks and fire pits that complement the pool — or stand beautifully on their own.", ["Gazebos & pergolas", "Patios, sundecks & stamped concrete", "Fire pits"], "s:res-terrace"],
  ["remodel", "Remodeling", "A new life for an existing pool.", "From resurfacing to reshaping, our remodel team repairs and upgrades pools, spas and fountains for a range of budgets — your one-stop shop for the pool and deck.", ["Resurfacing, tile & coping", "Deck repair & resurfacing", "Reshaping & extensions", "Equipment, salt systems & solar heating"], "s:res-court"],
  ["lighting", "Lighting & Smart Control", "Evenings, considered.", "LED lighting in and around the pool, with a smart control system that runs every function — individually or as a group — from a single touch.", ["Color LED pool lighting", "Landscape & deck lighting", "Pool & spa automation"], "s:night-resort"],
];

pages["residential.html"] = layout({
  title: "Residential Custom Pools — Houston | Riviera Custom Pools",
  desc: "Custom geometric and free-form pools, spas, outdoor living and remodeling for Houston homes.",
  page: "residential.html",
  body: `
<section class="page-hero hero">
  <div class="bg">${img("s:res-dusk", "Modern residence and pool at dusk", { eager: true })}</div>
  <div class="content"><div class="wrap">
    <div><span class="eyebrow rv">Residential</span><h1 class="h1">${lines("Custom pools for", "Houston&rsquo;s <em>finest</em>", "homes.")}</h1></div>
    <p class="side rv rv-d2">We sit with you, design the pool and options for your backyard, and build it with the same discipline we bring to commercial work.</p>
  </div></div>
  <div class="credit">Representative imagery</div>
</section>

<section class="pad">
  <div class="wrap">
    ${resSections.map(([id, eb, h, p, list, im], i) => `<div class="split ${i % 2 ? "r" : "l"}" id="${id}" style="scroll-margin-top:120px">
      <div class="media rv-img">${img(im, eb, { sizes: "(max-width: 860px) 100vw, 58vw" })}<span class="tag">Representative imagery</span></div>
      <div class="tx rv"><span class="eyebrow">0${i + 1} · ${eb}</span><h2 class="h3">${h}</h2><p>${p}</p><ul class="checks">${list.map((l) => `<li>${l}</li>`).join("")}</ul></div>
    </div>`).join("")}
  </div>
</section>

<section class="pad dark">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">Riviera Portfolio</span><h2 class="h1">${lines("Built by <em>Riviera.</em>")}</h2></div>
      <div class="a rv"><p>A selection of residential pools, spas and water features from our own project photography.</p><a class="link" href="projects.html?filter=residential">View projects ${arrow}</a></div>
    </div>
    <div class="mosaic">
      ${["geometric-3", "geometric-5", "custom-6", "geometric-2", "geometric-4", "custom-7", "geometric-6", "custom-9", "geometric-1", "custom-5", "geometric-9", "custom-2"].map((n, i) => `<div class="media zoom rv-img${i % 3 ? ` rv-d${i % 3}` : ""}">${img("r:" + n, "Riviera residential pool project")}</div>`).join("")}
    </div>
  </div>
</section>

${quotes()}
${cta({ title: "Let&rsquo;s build your <em>backyard.</em>", text: "Tell us about your home and how you want to use the space. We&rsquo;ll design around it — and give you a free estimate." })}`,
});

const order = ["rooftop-amenity-pool", "waterfront-loggia-pool", "estate-pool-pavilion", "hotel-courtyard-pool", "sunset-pool-terrace", "water-wall-terrace", "natural-stone-spa", "resort-lap-pool", "poolside-bar-pavilion", "courtyard-water-features", "grotto-waterfall-pool", "sun-shelf-pool", "palm-court-pool", "free-form-lagoon"];
pages["projects.html"] = layout({
  title: "Projects | Riviera Custom Pools",
  desc: "Selected commercial and residential pool projects by Riviera Custom Pools, Houston.",
  page: "projects.html",
  lightNav: true,
  body: `
<section class="text-hero">
  <div class="wrap">
    <span class="eyebrow rv">Projects</span>
    <div class="row">
      <h1 class="display">${lines("Selected", "<em>work.</em>")}</h1>
      <div class="filters rv rv-d2" role="group" aria-label="Filter projects">
        <button data-f="all" class="on">All</button><button data-f="commercial">Commercial</button><button data-f="residential">Residential</button>
      </div>
    </div>
  </div>
</section>
<section style="padding-bottom: clamp(88px, 12vw, 180px)">
  <div class="wrap">
    <div class="pgrid">
      ${order.map((s, i) => card(P[s], P[s].size, String(i + 1).padStart(2, "0"), P[s].size === "p-xl" ? "100vw" : "(max-width: 860px) 100vw, 50vw")).join("")}
    </div>
  </div>
</section>
${cta()}`,
});

pages["about.html"] = layout({
  title: "About | Riviera Custom Pools",
  desc: "Established in 2004 by Luis Ramirez, Riviera Custom Pools builds commercial and residential pools across Greater Houston.",
  page: "about.html",
  lightNav: true,
  body: `
<section class="text-hero">
  <div class="wrap">
    <span class="eyebrow rv">About Riviera</span>
    <div class="row"><h1 class="display">${lines("Two decades", "in Houston", "<em>pools.</em>")}</h1>
    <p class="lede rv rv-d2" style="max-width:26em">Established in July 2004. Commercial and residential pools across Greater Houston.</p></div>
  </div>
</section>

<section class="full-img"><div class="media rv-img" style="height:100%">${img("s:res-villa", "Contemporary residence with pool", { sizes: "100vw" })}<span class="tag">Representative imagery</span></div></section>

<section class="pad">
  <div class="wrap">
    <div class="split l" style="align-items:start">
      <div class="tx rv" style="grid-column:1 / span 5"><span class="eyebrow">Our founder</span><h2 class="h2">Luis Ramirez</h2></div>
      <div class="tx rv rv-d1" style="grid-column:7 / -1">
        <p class="lede">Luis Ramirez spent years in the pool industry before founding Riviera — more than a decade working alongside two of Houston&rsquo;s leading trades, JR Pool Plastering and Texas Gunite LTD.</p>
        <p>There he supported thousands of pool projects across Greater Houston and learned what it takes to build pools that last, with solid warranties to back them up. In 2004 he started Riviera Custom Pools, and has served Houston&rsquo;s homeowners, hotels and communities ever since.</p>
        <p>As a focused company, we must be impeccable with our word. That means an easy-to-understand proposal, a fixed price and a clear timeline — and relationships that last long after the pool is complete.</p>
      </div>
    </div>
  </div>
</section>

<section class="pad tint">
  <div class="wrap intro">
    <span class="eyebrow rv">Our mission</span>
    <p class="statement rv">To build the best quality custom pools, spas and remodels — <span class="muted">never compromising quality for profit, with high-quality materials, outstanding workmanship and service before, during and after construction.</span></p>
    <div class="facts">
      <div class="fact rv"><div class="v">2004</div><div class="l">Riviera Custom Pools established in Houston.</div></div>
      <div class="fact rv rv-d1"><div class="v">20<span class="accent">+</span></div><div class="l">Years of experience in Houston pool construction.</div></div>
      <div class="fact rv rv-d2"><div class="v">99<span class="accent">%</span></div><div class="l">On time and under budget, weather permitting.</div></div>
    </div>
  </div>
</section>

<section class="pad dark" id="process" style="scroll-margin-top:40px">
  <div class="wrap">
    <div class="sec-head">
      <div class="t"><span class="eyebrow rv">The Process</span><h2 class="h1">${lines("Design first.", "Then six <em>phases.</em>")}</h2></div>
      <div class="a rv"><p>We sit with you to design the pool, customise its shape and select finishes from our suppliers&rsquo; stone, glass, mosaic and coping ranges. Then we set a construction schedule that works around your day-to-day.</p></div>
    </div>
    ${processSteps()}
  </div>
</section>

<section class="pad">
  <div class="wrap">
    <div class="sec-head"><div class="t"><span class="eyebrow rv">Where we build</span><h2 class="h1">${lines("Greater <em>Houston.</em>")}</h2></div></div>
    <p class="statement rv" style="max-width:24em">${AREAS.map((a, i) => (i % 2 ? `<span class="muted">${a}</span>` : a)).join(" · ")}</p>
  </div>
</section>

${quotes("tint")}
${cta()}`,
});

pages["contact.html"] = layout({
  title: "Start a Project | Riviera Custom Pools",
  desc: "Request a free estimate from Riviera Custom Pools — commercial and residential pools in Houston.",
  page: "contact.html",
  lightNav: true,
  body: `
<section class="contact">
  <div class="left">
    <div class="media">${img("s:night-villa", "Pool at night", { sizes: "(max-width: 860px) 100vw, 42vw", eager: true })}</div>
    <div class="inner">
      <span class="eyebrow">Riviera Custom Pools</span>
      <h2 class="h2">Free estimates for commercial & residential projects.</h2>
      <dl>
        <div><dt>Call</dt><dd><a href="${TEL}">${PHONE}</a></dd></div>
        <div><dt>Visit</dt><dd>${ADDRESS[0]}, ${ADDRESS[1]}</dd></div>
        <div><dt>Serving</dt><dd>Greater Houston & surrounding areas</dd></div>
      </dl>
    </div>
  </div>
  <div class="right">
    <span class="eyebrow rv">Start a Project</span>
    <h1 class="h1" style="margin-top:22px">${lines("Tell us about", "your <em>project.</em>")}</h1>
    <form class="rf" novalidate>
      <fieldset class="full" style="border:0;padding:0;margin:0">
        <legend class="small" style="font-size:10.5px;letter-spacing:.18em;text-transform:uppercase">Project type</legend>
        <div class="seg">
          ${[["hospitality", "Hotel / Hospitality"], ["multifamily", "Multifamily"], ["commercial", "Other commercial"], ["residential", "New residential pool"], ["remodel", "Remodel"]].map(([v, l], i) => `<label><input type="radio" name="sector" value="${v}"${i === 0 ? " required" : ""}><span>${l}</span></label>`).join("")}
        </div>
      </fieldset>
      <label>Name<input name="name" required autocomplete="name"></label>
      <label>Company <span style="text-transform:none;letter-spacing:0">(optional)</span><input name="company" autocomplete="organization"></label>
      <label>Email<input type="email" name="email" required autocomplete="email"></label>
      <label>Phone<input type="tel" name="phone" autocomplete="tel"></label>
      <label>Project location<input name="location" placeholder="City or neighborhood"></label>
      <label>Timeline<select name="timeline"><option>Within 3 months</option><option>3–6 months</option><option>6–12 months</option><option>Planning stage</option></select></label>
      <label class="full">Project details<textarea name="message" required placeholder="Property type, size, features you have in mind…"></textarea></label>
      <div class="send"><span class="small">Every project begins with a free estimate.</span><button class="btn solid" type="submit">Send Inquiry ${arrow}</button></div>
    </form>
    <div class="thanks" role="status">
      <span class="eyebrow">Thank you</span>
      <p class="statement">We&rsquo;ve received your project details and will be in touch shortly.</p>
      <p class="small">Prefer to talk now? Call <a class="accent" href="${TEL}">${PHONE}</a>.</p>
      <div><a class="link" href="projects.html">Browse projects ${arrow}</a></div>
    </div>
  </div>
</section>`,
});

// project pages
projects.forEach((p, idx) => {
  const next = projects[(idx + 1) % projects.length];
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const rep = src(p.img).rep;
  const hero = rep
    ? `<section class="page-hero hero">
  <div class="bg">${img(p.img, p.title, { eager: true })}</div>
  <div class="content"><div class="wrap">
    <div><span class="eyebrow rv">${catLabel(p.cat)} · ${p.kind}</span><h1 class="h1">${lines(p.title)}</h1></div>
  </div></div>
  <div class="credit">Representative imagery</div>
</section>`
    : `<section class="text-hero" style="padding-bottom:clamp(40px,6vh,72px)">
  <div class="wrap">
    <span class="eyebrow rv">${catLabel(p.cat)} · ${p.kind}</span>
    <div class="row"><h1 class="display">${lines(p.title)}</h1><a class="link rv" href="projects.html">All projects ${arrow}</a></div>
  </div>
</section>
<section><div class="wrap"><div class="media rv-img" style="aspect-ratio:16/9;max-width:1100px">${img(p.img, p.title)}</div></div></section>`;
  pages[purl(p)] = layout({
    title: `${p.title} | Riviera Custom Pools`,
    desc: p.overview,
    page: "projects.html",
    lightNav: !rep,
    body: `${hero}
<section class="pad">
  <div class="wrap pd-over">
    <dl class="specs rv">
      <div><dt>Sector</dt><dd>${catLabel(p.cat)}</dd></div>
      <div><dt>Type</dt><dd>${p.kind}</dd></div>
      <div><dt>Features</dt><dd>${p.features.join("<br>")}</dd></div>
      <div><dt>Builder</dt><dd>Riviera Custom Pools</dd></div>
    </dl>
    <div class="body rv rv-d1">
      <span class="eyebrow">Overview</span>
      <p class="statement">${p.overview}</p>
      <span class="notice">${rep ? "Representative imagery — final project photography and details to be supplied by Riviera." : "Riviera project photography. Project details to be confirmed with Riviera."}</span>
    </div>
  </div>
</section>
<section style="padding-bottom:clamp(88px,12vw,180px)">
  <div class="wrap seq">
    <div class="s-a"><div class="media rv-img">${img(p.gallery[0], "Related imagery", { sizes: "(max-width: 860px) 100vw, 58vw" })}${repTag(p.gallery[0])}</div></div>
    <div class="s-b"><div class="media rv-img" style="height:100%">${img(p.gallery[1], "Related imagery", { sizes: "(max-width: 860px) 100vw, 40vw" })}${repTag(p.gallery[1])}</div></div>
    ${rep ? `<div class="s-full"><div class="media rv-img">${img(p.gallery[2], "Related imagery", { sizes: "100vw" })}${repTag(p.gallery[2])}</div></div>` : ""}
  </div>
</section>
<section class="next">
  <a href="${purl(prev)}"><div class="media">${img(prev.img, prev.title, { sizes: "(max-width: 860px) 100vw, 50vw" })}</div><div class="t"><span class="eyebrow" style="color:rgba(236,231,222,.7)">Previous</span><span class="h3">${prev.title}</span></div></a>
  <a href="${purl(next)}"><div class="media">${img(next.img, next.title, { sizes: "(max-width: 860px) 100vw, 50vw" })}</div><div class="t"><span class="eyebrow" style="color:rgba(236,231,222,.7)">Next project</span><span class="h3">${next.title}</span></div></a>
</section>
${cta({ title: p.cat === "commercial" ? "Planning a <em>commercial</em> pool?" : "Let&rsquo;s build your <em>backyard.</em>" })}`,
  });
});

for (const [file, html] of Object.entries(pages)) writeFileSync(new URL(file, OUT), html);
console.log(`Built ${Object.keys(pages).length} pages`);
