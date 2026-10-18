(function () {
  const { $, store } = window.ECardUI;
  const cfg = window.ECARD;

  const grid = $("#company-grid");
  cfg.companies.forEach((c) => {
    const link = document.createElement("a");
    link.className = "company";
    link.href = `cards.html?company=${c.id}`;
    link.style.setProperty("--c", c.color);
    link.innerHTML = `
      <span class="company-mark">${c.logo ? `<img src="${c.logo}" alt="" loading="lazy">` : c.mark}</span>
      <span class="company-name">${c.name}</span>
      <span class="company-sector">${c.sector}</span>
      <span class="company-go">Make a card →</span>`;
    link.addEventListener("click", () => store.set("company", c.id));
    grid.append(link);
  });
})();
