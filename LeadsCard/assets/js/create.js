/* Personalize page: type your name/designation, see it live, download or share. */
(function () {
  const { $, store, toast, template, requireCompany } = window.ECardUI;
  const { renderCard, toBlob, fileName } = window.ECard;
  const cfg = window.ECARD;

  const company = requireCompany();
  if (!company) return;

  const form = $("#card-form");
  const nameEl = $("#name");
  const designationEl = $("#designation");
  const canvas = $("#preview");
  const hint = $("#hint");
  const thumbs = $("#thumbs");

  let current = template(new URLSearchParams(location.search).get("card"));

  const saved = store.get("person") || {};
  nameEl.value = saved.name || "";
  designationEl.value = saved.designation || "";

  const person = () => ({ name: nameEl.value.trim(), designation: designationEl.value.trim(), company });

  function draw() {
    return renderCard(canvas, current, person()).catch((err) => {
      console.error(err);
      hint.textContent = "The preview could not be drawn. Please reload the page.";
    });
  }

  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      draw();
    });
  }

  [nameEl, designationEl].forEach((el) =>
    el.addEventListener("input", () => {
      hint.textContent = "";
      store.set("person", { name: nameEl.value.trim(), designation: designationEl.value.trim() });
      schedule();
    })
  );

  // Design switcher
  const buttons = window.ECARD_TEMPLATES.map((t) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", t.name);
    btn.title = t.name;
    const mini = document.createElement("canvas");
    btn.append(mini);
    thumbs.append(btn);
    renderCard(mini, t, { company }, 0.12).catch(console.error);
    btn.addEventListener("click", () => select(t));
    return { t, btn };
  });

  function select(t) {
    current = t;
    buttons.forEach(({ t: other, btn }) => btn.setAttribute("aria-checked", String(other === t)));
    $("#design-name").textContent = t.name;
    history.replaceState(null, "", `?company=${company.id}&card=${t.id}`);
    draw();
  }

  async function makeFile() {
    const { name } = person();
    if (!name) {
      hint.textContent = "Add your name first.";
      nameEl.focus();
      return null;
    }
    await draw();
    const blob = await toBlob(canvas);
    return new File([blob], fileName(name, company), { type: "image/png" });
  }

  function save(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function failed(err) {
    console.error(err);
    hint.textContent = "Your browser blocked saving the image. Open the site from a web server (see README) or try another browser.";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const file = await makeFile();
      if (!file) return;
      save(file);
      toast("Card downloaded");
    } catch (err) {
      failed(err);
    }
  });

  $("#share").addEventListener("click", async () => {
    try {
      const file = await makeFile();
      if (!file) return;
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: cfg.occasion.greeting, text: `${cfg.occasion.greeting}!` });
      } else {
        save(file);
        toast("Downloaded — attach it to your post or message");
      }
    } catch (err) {
      if (err.name !== "AbortError") failed(err);
    }
  });

  select(current);
})();
