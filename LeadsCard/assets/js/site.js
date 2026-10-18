/* Shared helpers used by every page. */
(function () {
  const cfg = window.ECARD;
  const $ = (sel, el = document) => el.querySelector(sel);

  // <span data-text="occasion.tagline"> is filled from config.js.
  document.querySelectorAll("[data-text]").forEach((el) => {
    const value = el.dataset.text.split(".").reduce((o, k) => (o ? o[k] : undefined), cfg);
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  // localStorage can be unavailable (private mode, blocked storage); never let that break the page.
  const store = {
    get(key) {
      try { return JSON.parse(localStorage.getItem(`western-ecard:${key}`)); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(`western-ecard:${key}`, JSON.stringify(value)); } catch { /* ignore */ }
    },
  };

  let toastTimer;
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.append(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function template(id) {
    return window.ECARD_TEMPLATES.find((t) => t.id === id) || window.ECARD_TEMPLATES[0];
  }

  function findCompany(id) {
    return cfg.companies.find((c) => c.id === id) || null;
  }

  // The company chosen on the home page: from ?company=… first, then the last one used.
  const company = findCompany(new URLSearchParams(location.search).get("company")) || findCompany(store.get("company"));
  if (company) {
    store.set("company", company.id);
    document.querySelectorAll("[data-company-name]").forEach((el) => (el.textContent = company.name));
    document.querySelectorAll("[data-company-chip]").forEach((el) => (el.hidden = false));
    // Carry the company along on links such as "All samples".
    document.querySelectorAll("a[data-company-link]").forEach((a) => {
      const url = new URL(a.getAttribute("href"), location.href);
      url.searchParams.set("company", company.id);
      a.href = url.pathname.split("/").pop() + url.search;
    });
  }

  // For pages that only make sense once a company is chosen.
  function requireCompany() {
    if (!company) location.replace("companies.html");
    return company;
  }


  window.ECardUI = { $, store, toast, template, company, requireCompany };
})();
