/* Card designs. Each design is drawn as SVG so the site works with no image
   files. The artwork has no text: render.js writes the greeting, name,
   designation and company on top using the design's `text` layout.

   svg(company) gets the selected company from config.js.

   To use a designer-made image instead, give a design an `image` path
   (e.g. "assets/cards/my-card.jpg", 1080×1350) and delete its `svg`. */
(function () {
  const W = 1080, H = 1350;
  const n = (v) => Math.round(v * 10) / 10;

  function doc(defs, body) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`;
  }

  // Seeded random numbers, so a design looks the same every time it is drawn.
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Repeats shape(x, y) `count` times around (cx, cy) at radius r.
  function ring(cx, cy, count, r, shape, offset = 0) {
    let out = "";
    for (let i = 0; i < count; i++) {
      out += `<g transform="rotate(${n((360 / count) * i + offset)} ${cx} ${cy})">${shape(cx, cy - r)}</g>`;
    }
    return out;
  }

  function petal(x, y, len, w, attrs) {
    const h = len / 2;
    return `<path d="M${n(x)} ${n(y + h)}Q${n(x + w)} ${n(y)} ${n(x)} ${n(y - h)}Q${n(x - w)} ${n(y)} ${n(x)} ${n(y + h)}Z" ${attrs}/>`;
  }

  function sparkle(x, y, s, fill, opacity = 1) {
    return `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${fill}" opacity="${opacity}"/>`;
  }

  function marigold(x, y, r, petals, core) {
    let out = "";
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      out += `<circle cx="${n(x + Math.cos(a) * r * 0.62)}" cy="${n(y + Math.sin(a) * r * 0.62)}" r="${n(r * 0.45)}" fill="${petals}"/>`;
    }
    return out + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.55)}" fill="${petals}"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.26)}" fill="${core}"/>`;
  }

  const MARIGOLD_COLORS = [["#F28C28", "#C4561A"], ["#F7B21B", "#D9821A"]];

  // Flowers strung along a quadratic curve from p0 to p2.
  function swag(p0, p1, p2, count, r) {
    let out = `<path d="M${p0[0]} ${p0[1]}Q${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]}" stroke="#7A4A1A" stroke-width="3" fill="none"/>`;
    for (let i = 0; i <= count; i++) {
      const t = i / count, u = 1 - t;
      const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
      const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
      out += marigold(x, y, r, ...MARIGOLD_COLORS[i % 2]);
    }
    return out;
  }

  function strand(x, y0, y1, r) {
    let out = `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="#7A4A1A" stroke-width="3"/>`;
    let i = 0;
    for (let y = y0 + r; y <= y1; y += r * 1.6) out += marigold(x, y, r, ...MARIGOLD_COLORS[i++ % 2]);
    return out + `<path d="M${x - 12} ${y1 + 10}L${x + 12} ${y1 + 10}L${x} ${y1 + 52}Z" fill="#B3121B"/>`;
  }

  function diya(x, y, s) {
    return `
      <circle cx="${x}" cy="${n(y - 60 * s)}" r="${n(120 * s)}" fill="url(#flameGlow)"/>
      <path d="M${x} ${n(y - 18 * s)}C${n(x + 26 * s)} ${n(y - 50 * s)} ${n(x + 12 * s)} ${n(y - 92 * s)} ${x} ${n(y - 124 * s)}C${n(x - 12 * s)} ${n(y - 92 * s)} ${n(x - 26 * s)} ${n(y - 50 * s)} ${x} ${n(y - 18 * s)}Z" fill="url(#flame)"/>
      <path d="M${n(x - 88 * s)} ${n(y - 10 * s)}Q${x} ${n(y + 84 * s)} ${n(x + 88 * s)} ${n(y - 10 * s)}Z" fill="url(#clay)"/>
      <ellipse cx="${x}" cy="${n(y - 10 * s)}" rx="${n(88 * s)}" ry="${n(14 * s)}" fill="#E58A3C"/>
      ${[-40, -20, 0, 20, 40].map((d) => `<circle cx="${n(x + d * s)}" cy="${n(y + 18 * s + Math.abs(d) * -0.25 * s)}" r="${n(4 * s)}" fill="#FFD27A" opacity=".8"/>`).join("")}`;
  }

  /* ---------- Designs ---------- */

  function mandalaSvg() {
    const cx = 540, cy = 400, gold = "#E9B949";
    const defs = `
      <radialGradient id="bg" cx="50%" cy="32%" r="80%"><stop offset="0" stop-color="#A3141F"/><stop offset=".55" stop-color="#5C0911"/><stop offset="1" stop-color="#2B0306"/></radialGradient>
      <radialGradient id="glow"><stop offset="0" stop-color="#F7C65A" stop-opacity=".35"/><stop offset="1" stop-color="#F7C65A" stop-opacity="0"/></radialGradient>`;
    const body = `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <circle cx="${cx}" cy="${cy}" r="420" fill="url(#glow)"/>
      <g stroke="${gold}" fill="none">
        <circle cx="${cx}" cy="${cy}" r="38" fill="${gold}"/>
        ${ring(cx, cy, 12, 72, (x, y) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="30" stroke-width="3"/>`)}
        <circle cx="${cx}" cy="${cy}" r="112" stroke-width="2"/>
        ${ring(cx, cy, 24, 150, (x, y) => petal(x, y, 70, 22, `stroke-width="2" fill="${gold}" fill-opacity=".15"`))}
        <circle cx="${cx}" cy="${cy}" r="192" stroke-width="5" stroke-dasharray="0.1 14" stroke-linecap="round"/>
        ${ring(cx, cy, 36, 238, (x, y) => petal(x, y, 88, 18, `stroke-width="2"`), 5)}
        <circle cx="${cx}" cy="${cy}" r="285" stroke-width="2"/>
        ${ring(cx, cy, 72, 300, (x, y) => `<circle cx="${x}" cy="${y}" r="4" fill="${gold}" stroke="none"/>`)}
        ${ring(cx, cy, 18, 330, (x, y) => petal(x, y, 40, 12, `stroke-width="2" fill="${gold}" fill-opacity=".35"`))}
      </g>
      <rect x="36" y="36" width="1008" height="1278" rx="24" fill="none" stroke="${gold}" stroke-opacity=".7" stroke-width="2"/>
      <rect x="52" y="52" width="976" height="1246" rx="16" fill="none" stroke="${gold}" stroke-opacity=".35"/>
      ${[[36, 36], [1044, 36], [36, 1314], [1044, 1314]].map(([x, y]) => sparkle(x, y, 18, gold)).join("")}
      ${sparkle(170, 860, 14, gold, 0.8)}${sparkle(910, 870, 10, gold, 0.7)}${sparkle(880, 120, 12, gold, 0.6)}`;
    return doc(defs, body);
  }

  function diyaSvg() {
    const r = rng(7);
    let bokeh = "", stars = "";
    const warm = ["#FFC75F", "#FF9F45", "#FFE3A3"];
    for (let i = 0; i < 42; i++) {
      bokeh += `<circle cx="${n(r() * W)}" cy="${n(r() * H)}" r="${n(6 + r() * 36)}" fill="${warm[i % 3]}" opacity="${n(0.06 + r() * 0.24)}"/>`;
    }
    for (let i = 0; i < 70; i++) {
      stars += `<circle cx="${n(r() * W)}" cy="${n(r() * 560)}" r="${n(0.8 + r() * 1.8)}" fill="#fff" opacity="${n(0.3 + r() * 0.6)}"/>`;
    }
    const defs = `
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0A1433"/><stop offset=".55" stop-color="#1B2A66"/><stop offset="1" stop-color="#4A1E4F"/></linearGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
      <radialGradient id="flameGlow"><stop offset="0" stop-color="#FFB347" stop-opacity=".6"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>
      <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FF6A13"/><stop offset=".45" stop-color="#FFC43D"/><stop offset="1" stop-color="#FFF6C8"/></linearGradient>
      <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9601F"/><stop offset="1" stop-color="#6E260A"/></linearGradient>
      <radialGradient id="floor"><stop offset="0" stop-color="#FFB347" stop-opacity=".35"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient>`;
    const body = `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      ${stars}
      <g filter="url(#blur)">${bokeh}</g>
      <ellipse cx="540" cy="850" rx="520" ry="70" fill="url(#floor)"/>
      ${diya(150, 830, 0.8)}${diya(345, 825, 0.95)}${diya(540, 820, 1.2)}${diya(735, 825, 0.95)}${diya(930, 830, 0.8)}
      ${sparkle(190, 270, 14, "#FFD27A", 0.8)}${sparkle(890, 250, 18, "#FFD27A", 0.9)}${sparkle(820, 380, 9, "#FFD27A", 0.7)}`;
    return doc(defs, body);
  }

  function marigoldSvg() {
    const defs = `
      <radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#FFFBF2"/><stop offset="1" stop-color="#FCEBCB"/></radialGradient>`;
    let teeth = "";
    for (let x = 0; x < W; x += 36) teeth += `<path d="M${x} 1262L${x + 18} 1284L${x + 36} 1262Z" fill="#E9B949"/>`;
    const body = `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="24" fill="#B3121B"/>
      ${swag([0, 40], [180, 230], [360, 40], 11, 17)}
      ${swag([360, 40], [540, 230], [720, 40], 11, 17)}
      ${swag([720, 40], [900, 230], [1080, 40], 11, 17)}
      ${strand(64, 40, 700, 18)}${strand(1016, 40, 700, 18)}
      ${strand(360, 40, 300, 15)}${strand(720, 40, 300, 15)}
      ${sparkle(250, 470, 14, "#E9B949")}${sparkle(840, 460, 18, "#E9B949")}
      <rect y="1236" width="${W}" height="${H - 1236}" fill="#B3121B"/>
      <rect y="1244" width="${W}" height="6" fill="#E9B949"/>
      ${teeth}`;
    return doc(defs, body);
  }

  function corporateSvg(company) {
    let dots = "";
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 10; col++) dots += `<circle cx="${780 + col * 26}" cy="${1080 + row * 26}" r="3" fill="#8FB8FF" opacity=".28"/>`;
    }
    const defs = `
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071735"/><stop offset="1" stop-color="#0E3A8A"/></linearGradient>
      <radialGradient id="glow" cx="80%" cy="15%" r="60%"><stop offset="0" stop-color="#F5B82E" stop-opacity=".22"/><stop offset="1" stop-color="#F5B82E" stop-opacity="0"/></radialGradient>`;
    const body = `
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <path d="M620 0H820L300 ${H}H100Z" fill="#fff" opacity=".035"/>
      <path d="M880 0H960L440 ${H}H360Z" fill="#fff" opacity=".05"/>
      <path d="M1020 0H1080V140L560 ${H}H500Z" fill="#fff" opacity=".03"/>
      <circle cx="900" cy="230" r="320" fill="none" stroke="#3FA9F5" stroke-opacity=".25" stroke-width="2"/>
      <circle cx="900" cy="230" r="240" fill="none" stroke="#3FA9F5" stroke-opacity=".15" stroke-width="2"/>
      <circle cx="900" cy="230" r="160" fill="none" stroke="#F5B82E" stroke-opacity=".35" stroke-width="3" stroke-dasharray="6 14"/>
      ${ring(900, 230, 16, 90, (x, y) => petal(x, y, 60, 16, `fill="#F5B82E" fill-opacity=".18" stroke="#F5B82E" stroke-opacity=".5" stroke-width="2"`))}
      ${dots}
      <text x="110" y="170" font-family="Helvetica Neue, Arial, sans-serif" font-weight="800" font-size="40" letter-spacing="6" fill="#fff">${company.short.toUpperCase()}</text>
      <rect x="110" y="330" width="90" height="8" rx="4" fill="#F5B82E"/>
      ${sparkle(640, 430, 16, "#F5B82E")}${sparkle(700, 380, 9, "#F5B82E", 0.7)}`;
    return doc(defs, body);
  }

  function alponaSvg() {
    const cx = 540, cy = 450, red = "#B3121B", gold = "#E9B949";
    let band = "", scallopsTop = "", scallopsBottom = "";
    for (let x = 30; x < W; x += 60) {
      band += `<path d="M${x} 46L${x + 12} 60L${x} 74L${x - 12} 60Z" fill="#fff" opacity=".9"/><circle cx="${x + 30}" cy="60" r="4" fill="${gold}"/>`;
      band += `<path d="M${x} 1276L${x + 12} 1290L${x} 1304L${x - 12} 1290Z" fill="#fff" opacity=".9"/><circle cx="${x + 30}" cy="1290" r="4" fill="${gold}"/>`;
    }
    for (let x = 0; x <= W; x += 40) {
      scallopsTop += `<circle cx="${x + 20}" cy="128" r="20" fill="${red}"/>`;
      scallopsBottom += `<circle cx="${x + 20}" cy="1222" r="20" fill="${red}"/>`;
    }
    const body = `
      <rect width="${W}" height="${H}" fill="#FFFCF5"/>
      ${scallopsTop}<rect width="${W}" height="120" fill="${red}"/><rect y="112" width="${W}" height="6" fill="${gold}"/>
      ${scallopsBottom}<rect y="1230" width="${W}" height="120" fill="${red}"/><rect y="1232" width="${W}" height="6" fill="${gold}"/>
      ${band}
      <g stroke="${red}" fill="none">
        <circle cx="${cx}" cy="${cy}" r="58" fill="${red}" stroke="none"/>
        ${ring(cx, cy, 12, 38, (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="none"/>`)}
        ${ring(cx, cy, 16, 104, (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="${red}" stroke="none"/>`)}
        ${ring(cx, cy, 16, 150, (x, y) => petal(x, y, 96, 30, `stroke-width="4" fill="${red}" fill-opacity=".08"`), 11.25)}
        <circle cx="${cx}" cy="${cy}" r="210" stroke-width="3"/>
        ${ring(cx, cy, 48, 228, (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="${red}" stroke="none"/>`)}
        ${ring(cx, cy, 24, 262, (x, y) => petal(x, y, 34, 12, `stroke-width="3"`))}
      </g>
      ${sparkle(160, 560, 12, gold)}${sparkle(920, 560, 12, gold)}`;
    return doc("", body);
  }

  /* `text` positions are in card pixels (1080×1350). Leave a key out to skip that line. */
  window.ECARD_TEMPLATES = [
    {
      id: "mandala",
      name: "Sindoor Mandala",
      svg: mandalaSvg,
      text: {
        bangla: { y: 830, size: 64, color: "#E9B949" },
        greeting: { y: 912, size: 78, color: "#FBE7B5" },
        message: { y: 975, size: 30, color: "#F3D9C9", lineHeight: 42, maxWidth: 760 },
        rule: { y: 1078, color: "#E9B949" },
        name: { y: 1162, size: 60, color: "#FFFFFF" },
        designation: { y: 1212, size: 30, color: "#E9B949" },
        company: { y: 1258, size: 22, color: "#F3D9C9" },
      },
    },
    {
      id: "diya",
      name: "Diya Night",
      svg: diyaSvg,
      text: {
        bangla: { y: 230, size: 70, color: "#FFD27A" },
        greeting: { y: 322, size: 82, color: "#FFF3D6" },
        message: { y: 392, size: 30, color: "#D9DCF5", lineHeight: 42, maxWidth: 760 },
        rule: { y: 1010, color: "#FFC75F" },
        name: { y: 1100, size: 60, color: "#FFFFFF" },
        designation: { y: 1150, size: 30, color: "#FFC75F" },
        company: { y: 1198, size: 22, color: "#C9CCF0" },
      },
    },
    {
      id: "marigold",
      name: "Marigold Garland",
      svg: marigoldSvg,
      text: {
        maxWidth: 760,
        bangla: { y: 560, size: 72, color: "#B3121B" },
        greeting: { y: 650, size: 80, color: "#5A0710" },
        message: { y: 718, size: 30, color: "#6B3A2A", lineHeight: 42, maxWidth: 660 },
        rule: { y: 850, color: "#C9871F" },
        name: { y: 945, size: 60, color: "#3A0A0A" },
        designation: { y: 995, size: 30, color: "#B3121B" },
        company: { y: 1043, size: 22, color: "#6B3A2A" },
      },
    },
    {
      id: "corporate",
      name: "Corporate Blue",
      svg: corporateSvg,
      text: {
        align: "left",
        x: 110,
        maxWidth: 820,
        bangla: { y: 470, size: 70, color: "#F5B82E" },
        greeting: { y: 562, size: 84, color: "#FFFFFF" },
        message: { y: 632, size: 30, color: "#C6D4F0", lineHeight: 42, maxWidth: 720 },
        rule: { y: 905, color: "#F5B82E" },
        name: { y: 990, size: 62, color: "#FFFFFF" },
        designation: { y: 1042, size: 30, color: "#F5B82E" },
        company: { y: 1090, size: 22, color: "#9FB4DB" },
      },
    },
    {
      id: "alpona",
      name: "Laal Paar Alpona",
      svg: alponaSvg,
      text: {
        bangla: { y: 818, size: 60, color: "#B3121B" },
        greeting: { y: 898, size: 74, color: "#3A0A0A" },
        message: { y: 952, size: 28, color: "#6B3A2A", lineHeight: 38, maxWidth: 760 },
        rule: { y: 1032, color: "#C9871F" },
        name: { y: 1102, size: 56, color: "#3A0A0A" },
        designation: { y: 1144, size: 28, color: "#B3121B" },
        company: { y: 1182, size: 20, color: "#6B3A2A" },
      },
    },
  ];
})();
