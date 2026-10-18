/* Design picker: a stacked deck of cards you can swipe, click or arrow through. */
(function () {
  const { $, requireCompany } = window.ECardUI;
  const { renderCard } = window.ECard;
  const templates = window.ECARD_TEMPLATES;
  const samples = window.ECARD.samples;

  const company = requireCompany();
  if (!company) return;

  const deck = $("#deck");
  const label = $("#deck-label");
  const count = $("#deck-count");
  const useBtn = $("#use-card");

  const requested = new URLSearchParams(location.search).get("card");
  let active = Math.max(0, templates.findIndex((t) => t.id === requested));
  let swiped = false;

  const cards = templates.map((t, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "deck-card";
    btn.setAttribute("aria-label", t.name);
    const canvas = document.createElement("canvas");
    btn.append(canvas);
    deck.append(btn);
    const sample = samples.find((s) => s.card === t.id) || {};
    renderCard(canvas, t, { ...sample, company }, 0.5).catch(console.error);
    btn.addEventListener("click", () => {
      if (swiped) return (swiped = false);
      if (i === active) choose();
      else show(i);
    });
    return btn;
  });

  function show(i) {
    const len = templates.length;
    active = (i + len) % len;
    cards.forEach((el, j) => {
      let offset = j - active;
      if (offset > len / 2) offset -= len;
      if (offset < -len / 2) offset += len;
      const depth = Math.abs(offset);
      el.style.transform = `translateX(${offset * 14}%) rotate(${offset * 5}deg) scale(${1 - depth * 0.08})`;
      el.style.zIndex = String(10 - depth);
      el.style.opacity = depth > 2 ? "0" : "1";
      el.classList.toggle("is-active", depth === 0);
      el.tabIndex = depth === 0 ? 0 : -1;
    });
    label.textContent = templates[active].name;
    count.textContent = `${active + 1} / ${len}`;
    history.replaceState(null, "", `?company=${company.id}&card=${templates[active].id}`);
  }

  function choose() {
    location.href = `create.html?company=${company.id}&card=${templates[active].id}`;
  }

  $("#prev").addEventListener("click", () => show(active - 1));
  $("#next").addEventListener("click", () => show(active + 1));
  useBtn.addEventListener("click", choose);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(active - 1);
    if (e.key === "ArrowRight") show(active + 1);
  });

  let startX = null;
  deck.addEventListener("pointerdown", (e) => (startX = e.clientX));
  deck.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      swiped = true;
      show(active + (dx < 0 ? 1 : -1));
      setTimeout(() => (swiped = false), 0);
    }
  });

  show(active);
})();
