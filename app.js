const translations = {
  sr: {
    nav_demo: "Demo",
    nav_how: "Kako radi",
    nav_pricing: "Cene",
    badge: "AI prodajni konsultant za SMB",
    hero_title: "AI koji pretvara posetioce sajta u nove klijente.",
    hero_text: "Infinity AI razgovara sa posetiocima, odgovara na pitanja, kvalifikuje potražnju i šalje vruće leadove vašem prodajnom timu 24/7.",
    hero_button: "Pokreni demo",
    send: "Pošalji",
    crm_title: "Novi leadovi",
    properties_title: "Demo preporuke nekretnina",
    how_title: "Kako Infinity AI radi",
    step1_title: "Instalacija jednom linijom",
    step1_text: "Widget se dodaje na bilo koji sajt jednim script tagom.",
    step2_title: "AI započinje razgovor",
    step2_text: "Posetioci odmah dobijaju odgovore, bez čekanja menadžera.",
    step3_title: "Kvalifikacija leada",
    step3_text: "AI pita budžet, lokaciju, rok i kontakt podatke.",
    step4_title: "Lead ide prodaji",
    step4_text: "Kontakt se šalje u CRM, email, Telegram ili n8n.",
    pricing_title: "Cene za brz start",
    starter: "Za male biznise koji žele da testiraju AI leadove.",
    business: "Za aktivne timove kojima trebaju automatizacija i integracije.",
    custom: "Po dogovoru",
    enterprise: "Custom workflow, integracije i onboarding.",
    name_placeholder: "Ime",
    phone_placeholder: "Telefon",
    success: "✅ Hvala! Zahtev je poslat agentu.",
    rooms: "soba",
    area: "m²",
    quick: ["Kupovina", "Prodaja", "Zakazivanje", "Pitaj AI"],
    chat: [
      ["ai", "👋 Dobrodošli! Ja sam Infinity AI."],
      ["ai", "Šta tražite danas?"],
      ["user", "Stan u Novom Sadu"],
      ["ai", "Odlično. Koji je vaš budžet?"],
      ["user", "Do €150,000"],
      ["ai", "Savršeno. Pronašao sam nekoliko relevantnih opcija. Ostavite telefon i agent će vas kontaktirati."]
    ],
    properties: [
      { icon: "🏢", title: "Moderan stan kod Limana", location: "Novi Sad · Liman", area: 87, rooms: 3, price: 149900 },
      { icon: "🏡", title: "Porodična kuća sa dvorištem", location: "Novi Sad · Telep", area: 155, rooms: 5, price: 239000 },
      { icon: "🏙️", title: "Poslovni prostor u centru", location: "Novi Sad · Centar", area: 120, rooms: 6, price: 319000 }
    ]
  },

  en: {
    nav_demo: "Demo",
    nav_how: "How it works",
    nav_pricing: "Pricing",
    badge: "AI sales consultant for SMB",
    hero_title: "AI that converts website visitors into customers.",
    hero_text: "Infinity AI talks to visitors, answers questions, qualifies demand and sends hot leads directly to your sales team 24/7.",
    hero_button: "Start demo",
    send: "Send",
    crm_title: "New leads",
    properties_title: "Demo property recommendations",
    how_title: "How Infinity AI works",
    step1_title: "Install one line",
    step1_text: "The widget is added to any website with one script tag.",
    step2_title: "AI starts conversation",
    step2_text: "Visitors get instant answers without waiting for a manager.",
    step3_title: "Lead qualification",
    step3_text: "AI asks budget, location, timing and contact details.",
    step4_title: "Lead goes to sales",
    step4_text: "Contact is sent to CRM, email, Telegram or n8n.",
    pricing_title: "Pricing for fast launch",
    starter: "For small businesses that want to test AI leads.",
    business: "For active teams that need automation and integrations.",
    custom: "Custom",
    enterprise: "Custom workflow, integrations and onboarding.",
    name_placeholder: "Name",
    phone_placeholder: "Phone",
    success: "✅ Thank you! Your request has been sent to an agent.",
    rooms: "rooms",
    area: "m²",
    quick: ["Buy", "Sell", "Book viewing", "Ask AI"],
    chat: [
      ["ai", "👋 Welcome! I am Infinity AI."],
      ["ai", "What are you looking for today?"],
      ["user", "Apartment in Novi Sad"],
      ["ai", "Great. What is your budget?"],
      ["user", "Up to €150,000"],
      ["ai", "Perfect. I found several relevant options. Leave your phone and an agent will contact you."]
    ],
    properties: [
      { icon: "🏢", title: "Modern apartment near Liman", location: "Novi Sad · Liman", area: 87, rooms: 3, price: 149900 },
      { icon: "🏡", title: "Family house with garden", location: "Novi Sad · Telep", area: 155, rooms: 5, price: 239000 },
      { icon: "🏙️", title: "Downtown office space", location: "Novi Sad · Centar", area: 120, rooms: 6, price: 319000 }
    ]
  }
};
const leads = [
  { name: "Milan Petrović", need: "Apartment · Novi Sad", budget: "€150,000" },
  { name: "Ana Jovanović", need: "House · Telep", budget: "€240,000" },
  { name: "Marko Ilić", need: "Office · Centar", budget: "€320,000" },
  { name: "Jelena Nikolić", need: "Apartment · Liman", budget: "€118,000" }
];

let currentLang = localStorage.getItem("infinity_lang") || "sr";
let leadTimer = null;

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return document.querySelectorAll(selector);
}

function getText(key) {
  return translations[currentLang][key] || translations.en[key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("infinity_lang", lang);
  document.documentElement.lang = lang;

  $all("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    el.textContent = getText(key);
  });

  const nameInput = $("#leadName");
  const phoneInput = $("#leadPhone");

  if (nameInput) nameInput.placeholder = getText("name_placeholder");
  if (phoneInput) phoneInput.placeholder = getText("phone_placeholder");

  renderQuickReplies();
  renderProperties();
  restartChat();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addMessage(type, text) {
  const box = $("#chatMessages");
  if (!box) return;

  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function addTyping() {
  const box = $("#chatMessages");
  const div = document.createElement("div");
  div.className = "message ai typing";
  div.innerHTML = "<b></b><b></b><b></b>";
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

async function playChat() {
  const box = $("#chatMessages");
  if (!box) return;

  box.innerHTML = "";
  const scenario = translations[currentLang].chat;

  for (const item of scenario) {
    const type = item[0];
    const text = item[1];

    if (type === "ai") {
      const typing = addTyping();
      await sleep(650);
      typing.remove();
    }

    addMessage(type, text);
    await sleep(950);
  }

  const form = $("#leadForm");
  if (form) form.classList.remove("hidden");
}

function restartChat() {
  const form = $("#leadForm");
  if (form) form.classList.add("hidden");
  playChat();
}
function renderQuickReplies() {
  const box = $("#quickReplies");
  if (!box) return;

  box.innerHTML = translations[currentLang].quick
    .map((item) => `<button type="button">${item}</button>`)
    .join("");

  box.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      addMessage("user", button.textContent);

      setTimeout(() => {
        addMessage(
          "ai",
          currentLang === "sr"
            ? "Razumem. Da bih pripremio najbolju ponudu, ostavite kontakt."
            : "Got it. To prepare the best offer, please leave your contact."
        );

        $("#leadForm")?.classList.remove("hidden");
      }, 600);
    });
  });
}

function renderProperties() {
  const box = $("#properties");
  if (!box) return;

  const items = translations[currentLang].properties;

  box.innerHTML = items
    .map(
      (p) => `
        <article class="property-card">
          <div class="property-visual">${p.icon}</div>

          <div class="property-body">
            <h3>${p.title}</h3>
            <p>${p.location}</p>

            <div class="property-meta">
              <span>${p.area} ${getText("area")}</span>
              <span>${p.rooms} ${getText("rooms")}</span>
            </div>

            <div class="property-price">
              €${Number(p.price).toLocaleString("en-US")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function addLead(lead) {
  const list = $("#crmList");
  if (!list) return;

  const div = document.createElement("div");
  div.className = "lead-item";

  div.innerHTML = `
    <strong>${lead.name}</strong>
    <span>${lead.need}</span>
    <small>${lead.budget} · NEW</small>
  `;

  list.prepend(div);

  while (list.children.length > 5) {
    list.lastElementChild.remove();
  }
}

function startCRM() {
  const list = $("#crmList");
  if (!list) return;

  list.innerHTML = "";
  leads.slice(0, 3).forEach(addLead);

  let index = 3;

  if (leadTimer) clearInterval(leadTimer);

  leadTimer = setInterval(() => {
    addLead(leads[index % leads.length]);
    index += 1;
  }, 4200);
}

function setupLeadForm() {
  const form = $("#leadForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#leadName")?.value.trim() || "New Lead";
    const phone = $("#leadPhone")?.value.trim() || "";

    addLead({
      name,
      need: phone || "Website demo",
      budget: "Qualified"
    });

    form.reset();
    form.classList.add("hidden");
    addMessage("ai", getText("success"));
  });
}

function init() {
  setLang(currentLang);
  renderQuickReplies();
  renderProperties();
  startCRM();
  setupLeadForm();
}

document.addEventListener("DOMContentLoaded", init);
