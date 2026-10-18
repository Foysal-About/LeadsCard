/* Draws a card (artwork + text) onto a <canvas>. The same canvas is used for
   the on-screen preview and the downloaded PNG, so what you see is what you get. */
(function () {
  const W = 1080, H = 1350;
  const cfg = window.ECARD;

  const FAMILY = {
    bangla: '"Noto Serif Bengali", serif',
    display: '"Playfair Display", Georgia, serif',
    sans: '"Plus Jakarta Sans", system-ui, sans-serif',
  };

  const FONT = {
    bangla: (s) => `700 ${s}px ${FAMILY.bangla}`,
    greeting: (s) => `italic 700 ${s}px ${FAMILY.display}`,
    message: (s) => `500 ${s}px ${FAMILY.sans}`,
    name: (s) => `700 ${s}px ${FAMILY.display}`,
    designation: (s) => `600 ${s}px ${FAMILY.sans}`,
    company: (s) => `700 ${s}px ${FAMILY.sans}`,
  };

  const images = new Map();
  let fonts;

  function loadImage(src) {
    if (!images.has(src)) {
      images.set(src, new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Could not load card artwork: ${src.slice(0, 60)}`));
        img.src = src;
      }));
    }
    return images.get(src);
  }

  // Canvas text only uses web fonts once they are loaded, so wait for them.
  function loadFonts() {
    if (!fonts) {
      fonts = Promise.all([
        document.fonts.load(FONT.bangla(40), cfg.occasion.bangla || "শ"),
        document.fonts.load(FONT.greeting(40)),
        document.fonts.load(FONT.name(40)),
        document.fonts.load(FONT.message(20)),
        document.fonts.load(FONT.designation(20)),
        document.fonts.load(FONT.company(20)),
      ]).catch(() => {});
    }
    return fonts;
  }

  function artwork(template, company) {
    return template.image || "data:image/svg+xml;charset=utf-8," + encodeURIComponent(template.svg(company));
  }

  // Shrinks the font until the text fits on one line (down to half size).
  function fit(ctx, text, font, size, maxWidth) {
    let s = size;
    do {
      ctx.font = font(s);
    } while (ctx.measureText(text).width > maxWidth && (s -= 2) > size * 0.5);
  }

  function wrap(ctx, text, maxWidth) {
    const lines = [];
    let line = "";
    for (const word of text.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function setSpacing(ctx, px) {
    if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
  }

  // A short divider with a diamond: centred on x, or starting at x when left-aligned.
  function rule(ctx, style, x, left) {
    const mid = left ? x + 8 : x;
    ctx.strokeStyle = ctx.fillStyle = style.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (left) {
      ctx.moveTo(x + 24, style.y); ctx.lineTo(x + 170, style.y);
    } else {
      ctx.moveTo(x - 100, style.y); ctx.lineTo(x - 16, style.y);
      ctx.moveTo(x + 16, style.y); ctx.lineTo(x + 100, style.y);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mid, style.y - 8); ctx.lineTo(mid + 8, style.y); ctx.lineTo(mid, style.y + 8); ctx.lineTo(mid - 8, style.y);
    ctx.fill();
  }

  /* person: { name, designation, company }. Empty name/designation show the
     placeholder, faded; company is one of the entries in config.js. */
  async function renderCard(canvas, template, person = {}, scale = 1) {
    const company = person.company || cfg.companies[0];
    const [img] = await Promise.all([loadImage(artwork(template, company)), loadFonts()]);
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.drawImage(img, 0, 0, W, H);

    const layout = template.text;
    const left = layout.align === "left";
    const x = left ? layout.x : W / 2;
    const maxWidth = layout.maxWidth || 860;
    ctx.textAlign = left ? "left" : "center";
    ctx.textBaseline = "alphabetic";

    const lines = {
      bangla: cfg.occasion.bangla,
      greeting: cfg.occasion.greeting,
      name: person.name || cfg.placeholders.name,
      designation: person.designation || cfg.placeholders.designation,
      company: company.name.toUpperCase(),
    };
    const placeholder = { name: !person.name, designation: !person.designation };

    for (const key of Object.keys(lines)) {
      const style = layout[key];
      if (!style || !lines[key]) continue;
      ctx.globalAlpha = placeholder[key] ? 0.55 : 1;
      ctx.fillStyle = style.color;
      setSpacing(ctx, key === "company" ? 4 : 0);
      fit(ctx, lines[key], FONT[key], style.size, maxWidth);
      ctx.fillText(lines[key], x, style.y);
    }
    ctx.globalAlpha = 1;
    setSpacing(ctx, 0);

    const msg = layout.message;
    if (msg && cfg.occasion.message) {
      ctx.font = FONT.message(msg.size);
      ctx.fillStyle = msg.color;
      wrap(ctx, cfg.occasion.message, msg.maxWidth || maxWidth).forEach((line, i) => {
        ctx.fillText(line, x, msg.y + i * msg.lineHeight);
      });
    }

    if (layout.rule) rule(ctx, layout.rule, x, left);
    return canvas;
  }

  function toBlob(canvas) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not create the image"))), "image/png");
      } catch (err) {
        reject(err);
      }
    });
  }

  function fileName(name, company) {
    const slug = (name || "card").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "card";
    return `${cfg.filePrefix}-${company.id}-${slug}.png`;
  }

  window.ECard = { W, H, renderCard, toBlob, fileName };
})();
