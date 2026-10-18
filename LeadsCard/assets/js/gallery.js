(function () {
  const { $, template, company } = window.ECardUI;
  const { renderCard } = window.ECard;
  const cfg = window.ECARD;
  const grid = $("#gallery");

  // With a company chosen, show its cards; otherwise spread the samples across the group.
  cfg.samples.forEach((sample, i) => {
    const c = company || cfg.companies[i % cfg.companies.length];
    const t = template(sample.card);
    const link = document.createElement("a");
    link.className = "gallery-item";
    link.href = `create.html?company=${c.id}&card=${t.id}`;
    link.innerHTML = `<canvas role="img" aria-label="${t.name} card for ${sample.name}, ${c.name}"></canvas><span>${t.name}<em>Use this design →</em></span>`;
    grid.append(link);
    renderCard(link.querySelector("canvas"), t, { ...sample, company: c }, 0.5).catch(console.error);
  });
})();
