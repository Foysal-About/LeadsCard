(function () {
  const { $, template } = window.ECardUI;
  const { renderCard } = window.ECard;
  const cfg = window.ECARD;

  // Three sample cards from different companies, fanned out in the hero.
  const fan = $("#hero-fan");
  cfg.samples.slice(0, 3).forEach((sample, i) => {
    const company = cfg.companies[(i * 2 + 1) % cfg.companies.length];
    const canvas = document.createElement("canvas");
    canvas.className = "fan-card";
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `Sample e-card for ${sample.name}, ${company.name}`);
    fan.append(canvas);
    renderCard(canvas, template(sample.card), { ...sample, company }, 0.5).catch(console.error);
  });
})();
