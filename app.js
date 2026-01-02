const LANG_KEY = "regionality_lang";

const SUPPORTED = [
  { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
  { code: "pl", label: "PL", name: "Polski",  flag: "🇵🇱" },
  { code: "tl", label: "TL", name: "Tagalog", flag: "🇵🇭" },
  { code: "es", label: "ES", name: "Español", flag: "🇪🇸" },
];

let I18N = null;
let CURRENT_LANG = null;

function getSavedLang(){
  return localStorage.getItem(LANG_KEY);
}
function setSavedLang(code){
  localStorage.setItem(LANG_KEY, code);
}
function detectLang(){
  const nav = (navigator.language || "en").toLowerCase();
  if(nav.startsWith("pl")) return "pl";
  if(nav.startsWith("es")) return "es";
  // Tagalog is usually "tl" or "fil"
  if(nav.startsWith("tl") || nav.startsWith("fil")) return "tl";
  return "en";
}

async function loadLang(code){
  const res = await fetch(`lang/${code}.json`, { cache: "no-cache" });
  if(!res.ok) throw new Error("Cannot load language file");
  I18N = await res.json();
  CURRENT_LANG = code;

  // update html lang
  document.documentElement.lang = code === "tl" ? "fil" : code;

  // update language button label
  const meta = SUPPORTED.find(x => x.code === code) || SUPPORTED[0];
  document.getElementById("langBtnLabel").textContent = `${meta.flag} ${meta.label}`;
}

function t(path){
  const parts = path.split(".");
  let cur = I18N;
  for(const p of parts){
    if(!cur || typeof cur !== "object" || !(p in cur)) return path;
    cur = cur[p];
  }
  return cur;
}

function renderLangMenu(){
  const menu = document.getElementById("langMenu");
  menu.innerHTML = "";
  SUPPORTED.forEach(l => {
    const btn = document.createElement("button");
    btn.className = "lang-item";
    btn.type = "button";
    btn.role = "menuitem";
    btn.innerHTML = `<span>${l.flag}</span><div><div><strong>${l.name}</strong></div><small>${l.label}</small></div>`;
    btn.addEventListener("click", async () => {
      await setLang(l.code);
      closeLangMenu();
    });
    menu.appendChild(btn);
  });
}

function openLangMenu(){
  const menu = document.getElementById("langMenu");
  menu.classList.add("open");
  document.getElementById("langBtn").setAttribute("aria-expanded", "true");
}
function closeLangMenu(){
  const menu = document.getElementById("langMenu");
  menu.classList.remove("open");
  document.getElementById("langBtn").setAttribute("aria-expanded", "false");
}

function getRoute(){
  const h = (location.hash || "#home").replace("#", "");
  // allowed:
  // home, announcements, faq, guides, guides-nintendo, guides-xbox, guides-playstation, guides-steam,
  // vouches, payment-methods, price-list-nintendo, softban-nintendo
  return h || "home";
}

function pageShell(title, bodyHtml){
  return `
    <section class="page">
      <div class="page-head">
        <h2>${title}</h2>
        <a class="back" href="#home">${t("ui.backHome")}</a>
      </div>
      ${bodyHtml}
      <div class="footer">© <span id="year"></span> Regionality</div>
    </section>
  `;
}

function fig(src, caption){
  return `
    <figure class="figure">
      <img src="${src}" alt="" loading="lazy" />
      <figcaption class="figcap">${caption}</figcaption>
    </figure>
  `;
}

function renderHome(){
  const cards = [
    { id: "announcements", title: t("nav.announcements"), sub: t("navSub.announcements") },
    { id: "faq", title: t("nav.faq"), sub: t("navSub.faq") },
    { id: "guides", title: t("nav.guides"), sub: t("navSub.guides") },
    { id: "vouches", title: t("nav.vouches"), sub: t("navSub.vouches") },
    { id: "payment-methods", title: t("nav.paymentMethods"), sub: t("navSub.paymentMethods") },
    { id: "price-list-nintendo", title: t("nav.priceListNintendo"), sub: t("navSub.priceListNintendo") },
    { id: "softban-nintendo", title: t("nav.softbanNintendo"), sub: t("navSub.softbanNintendo") },
  ];

  const grid = cards.map(c => `
    <a class="card" href="#${c.id}">
      <span class="card-title">${c.title}</span>
      <span class="card-sub">${c.sub}</span>
    </a>
  `).join("");

  return `
    <section class="hero">
      <h1>${t("home.title")}</h1>
      <p>${t("home.sub")}</p>
    </section>
    <nav class="grid" aria-label="Main menu">
      ${grid}
    </nav>
    <div class="footer">© <span id="year"></span> Regionality</div>
  `;
}

function renderAnnouncements(){
  const body = `<p>${t("pages.announcements.body")}</p>`;
  return pageShell(t("pages.announcements.title"), body);
}

function renderFAQ(){
  const items = t("pages.faq.items");
  const html = items.map((it) => `
    <details class="faq">
      <summary>${it.q}</summary>
      <div class="ans">${it.aHtml}</div>
    </details>
  `).join("");

  return pageShell(t("pages.faq.title"), `
    <p>${t("pages.faq.intro")}</p>
    ${html}
  `);
}

function renderGuides(){
  const cards = [
    { id: "guides-nintendo", title: t("pages.guides.cards.nintendo.title"), sub: t("pages.guides.cards.nintendo.sub") },
    { id: "guides-xbox", title: t("pages.guides.cards.xbox.title"), sub: t("pages.guides.cards.xbox.sub") },
    { id: "guides-playstation", title: t("pages.guides.cards.playstation.title"), sub: t("pages.guides.cards.playstation.sub") },
    { id: "guides-steam", title: t("pages.guides.cards.steam.title"), sub: t("pages.guides.cards.steam.sub") },
  ];

  const grid = cards.map(c => `
    <a class="card" href="#${c.id}">
      <span class="card-title">${c.title}</span>
      <span class="card-sub">${c.sub}</span>
    </a>
  `).join("");

  return pageShell(t("pages.guides.title"), `
    <p>${t("pages.guides.intro")}</p>
    <div class="grid">${grid}</div>
  `);
}

function renderGuideNintendo(){
  const body = `
    <p>${t("pages.guides.nintendo.p1")}</p>
    ${fig("img/ticket-nintendo.png", t("pages.guides.nintendo.figTicket"))}
    <hr class="sep" />
    <h3>${t("pages.guides.nintendo.topupTitle")} <span class="badge">${t("ui.imageGuide")}</span></h3>
    ${fig("img/nintendo-topup-process.png", t("pages.guides.nintendo.figTopup"))}
    <hr class="sep" />
    <h3>${t("pages.guides.nintendo.pasabuyTitle")} <span class="badge">${t("ui.imageGuide")}</span></h3>
    ${fig("img/nintendo-pasabuy-process.png", t("pages.guides.nintendo.figPasabuy"))}
  `;
  return pageShell(t("pages.guides.cards.nintendo.title"), body);
}

function renderGuideXbox(){
  const body = `
    <p>${t("pages.guides.xbox.p1")}</p>
    ${fig("img/ticket-consoles.png", t("pages.guides.xbox.figTicket"))}
  `;
  return pageShell(t("pages.guides.cards.xbox.title"), body);
}

function renderGuidePlaystation(){
  const body = `
    <p>${t("pages.guides.playstation.p1")}</p>
    ${fig("img/ticket-consoles.png", t("pages.guides.playstation.figTicket"))}
  `;
  return pageShell(t("pages.guides.cards.playstation.title"), body);
}

function renderGuideSteam(){
  const body = `
    <p>${t("pages.guides.steam.p1")}</p>
    ${fig("img/ticket-steam.png", t("pages.guides.steam.figTicket"))}
  `;
  return pageShell(t("pages.guides.cards.steam.title"), body);
}

function renderVouches(){
  const body = `
    <p>${t("pages.vouches.body")}</p>
    ${fig("img/vouches.png", t("pages.vouches.fig"))}
  `;
  return pageShell(t("pages.vouches.title"), body);
}

function renderPayments(){
  const body = `
    <p>${t("pages.payments.intro")}</p>
    <div class="kinds">
      <div class="kind">
        <h3>${t("pages.payments.localPH.title")}</h3>
        <p>${t("pages.payments.localPH.items")}</p>
      </div>
      <div class="kind">
        <h3>${t("pages.payments.localPL.title")}</h3>
        <p>${t("pages.payments.localPL.items")}</p>
      </div>
      <div class="kind">
        <h3>${t("pages.payments.international.title")}</h3>
        <p>${t("pages.payments.international.items")}</p>
      </div>
      <div class="kind">
        <h3>${t("pages.payments.crypto.title")}</h3>
        <p>${t("pages.payments.crypto.items")}</p>
      </div>
    </div>
    <hr class="sep" />
    ${fig("img/payment-methods.png", t("pages.payments.fig"))}
  `;
  return pageShell(t("pages.payments.title"), body);
}

function renderPriceListNintendo(){
  const body = `<p>${t("pages.priceListNintendo.body")}</p>`;
  return pageShell(t("pages.priceListNintendo.title"), body);
}

function renderSoftbanNintendo(){
  const body = t("pages.softbanNintendo.bodyHtml");
  return pageShell(t("pages.softbanNintendo.title"), body);
}

function render(){
  const route = getRoute();
  const app = document.getElementById("app");

  let html = "";
  switch(route){
    case "home": html = renderHome(); break;
    case "announcements": html = renderAnnouncements(); break;
    case "faq": html = renderFAQ(); break;
    case "guides": html = renderGuides(); break;
    case "guides-nintendo": html = renderGuideNintendo(); break;
    case "guides-xbox": html = renderGuideXbox(); break;
    case "guides-playstation": html = renderGuidePlaystation(); break;
    case "guides-steam": html = renderGuideSteam(); break;
    case "vouches": html = renderVouches(); break;
    case "payment-methods": html = renderPayments(); break;
    case "price-list-nintendo": html = renderPriceListNintendo(); break;
    case "softban-nintendo": html = renderSoftbanNintendo(); break;
    default: html = renderHome(); break;
  }

  app.innerHTML = html;

  // year
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();

  // i18n small UI texts present in DOM
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
}

async function setLang(code){
  setSavedLang(code);
  await loadLang(code);
  render();
}

function setupOverlay(){
  const overlay = document.getElementById("langOverlay");
  const grid = document.getElementById("langOverlayGrid");
  grid.innerHTML = "";

  SUPPORTED.forEach(l => {
    const btn = document.createElement("button");
    btn.className = "lang-pick";
    btn.type = "button";
    btn.innerHTML = `<strong>${l.flag} ${l.name}</strong><small>${l.label}</small>`;
    btn.addEventListener("click", async () => {
      overlay.hidden = true;
      await setLang(l.code);
    });
    grid.appendChild(btn);
  });
}

function initLangUI(){
  renderLangMenu();

  const btn = document.getElementById("langBtn");
  btn.addEventListener("click", () => {
    const menu = document.getElementById("langMenu");
    if(menu.classList.contains("open")) closeLangMenu();
    else openLangMenu();
  });

  document.addEventListener("click", (e) => {
    const menu = document.getElementById("langMenu");
    const box = document.querySelector(".lang");
    if(!box.contains(e.target)) closeLangMenu();
  });
}

(async function init(){
  setupOverlay();
  initLangUI();

  // load language (but show overlay on first visit)
  const saved = getSavedLang();
  const overlay = document.getElementById("langOverlay");

  if(!saved){
    overlay.hidden = false;
    const auto = detectLang();
    await loadLang(auto); // so overlay texts are translated
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    // also set the button label to auto while overlay is up
    const meta = SUPPORTED.find(x => x.code === auto) || SUPPORTED[0];
    document.getElementById("langBtnLabel").textContent = `${meta.flag} ${meta.label}`;
  } else {
    await loadLang(saved);
    render();
  }

  window.addEventListener("hashchange", () => {
    if(CURRENT_LANG) render();
  });

  // if language is already saved, render once (handled above)
})();
// === HOTFIX: language overlay ===
window.setLang = async function(code){
  const overlay = document.getElementById("langOverlay");
  if (overlay) overlay.hidden = true;

  try {
    localStorage.setItem("regionality_lang", code);
    const res = await fetch(`lang/${code}.json`);
    const data = await res.json();
    window.__lang = data;
    if (typeof render === "function") render();
  } catch (err) {
    console.error(err);
    alert("Błąd języka: sprawdź plik lang/" + code + ".json (Console F12)");
    if (overlay) overlay.hidden = false;
  }
};

