const I18N = {
  en: {
    "nav.demo":"Live Demo","nav.how":"How it works","nav.pricing":"Pricing","nav.faq":"FAQ",
    "hero.eyebrow":"AI Sales Consultant for SMB",
    "hero.title":"AI that converts website visitors into customers.",
    "hero.subtitle":"Infinity AI talks to visitors, answers questions, qualifies demand and sends hot leads directly to your sales team 24/7.",
    "hero.cta":"Try live demo","hero.secondary":"View pricing",
    "stats.leads":"leads today","stats.chats":"AI chats","stats.conversion":"conversion",
    "chat.send":"Send","crm.title":"Live CRM","crm.subtitle":"New leads",
    "properties.kicker":"Real estate demo","properties.title":"AI can instantly recommend relevant properties","properties.subtitle":"For the first demo scenario, Infinity AI works as a real estate consultant for Novi Sad agencies.",
    "how.kicker":"How it works","how.title":"One widget. Full lead generation cycle.",
    "how.step1.title":"Install one line","how.step1.text":"The widget is added to any website with one script.",
    "how.step2.title":"AI starts the conversation","how.step2.text":"Visitors get answers instantly without waiting for a manager.",
    "how.step3.title":"Lead qualification","how.step3.text":"AI asks budget, location, timing and buyer intent.",
    "how.step4.title":"Sales receives the lead","how.step4.text":"Contacts are sent to CRM, email, Telegram or n8n.",
    "analytics.kicker":"Analytics","analytics.title":"See what happens in your funnel","analytics.text":"Track conversations, leads, conversion and response time from one clean dashboard.",
    "pricing.kicker":"Pricing","pricing.title":"Simple pricing for fast launch",
    "pricing.starter":"For small businesses starting with AI leads.",
    "pricing.business":"For active teams that need automation and integrations.",
    "pricing.enterprise":"Custom workflow, integrations and onboarding.",
    "pricing.button":"Start","pricing.popular":"Most popular","pricing.custom":"Custom","pricing.contact":"Contact us",
    "faq.title":"Questions clients usually ask",
    "faq.q1":"Can this work on any website?","faq.a1":"Yes. The widget can be installed with one script tag.",
    "faq.q2":"Can leads go to CRM or n8n?","faq.a2":"Yes. The demo is prepared for n8n, CRM and Supabase integrations.",
    "faq.q3":"Can it be adapted for other industries?","faq.a3":"Yes. Real estate is the first scenario. The same platform can work for clinics, lawyers, restaurants, hotels and more.",
    "cta.title":"Ready to turn website traffic into sales?",
    "cta.text":"Show customers a working AI sales assistant instead of explaining it with words.",
    "cta.button":"Open live demo",
    "footer.text":"Demo platform for tomorrow's sales."
  },
  sr: {
    "nav.demo":"Demo","nav.how":"Kako radi","nav.pricing":"Cene","nav.faq":"Pitanja",
    "hero.eyebrow":"AI prodajni konsultant za SMB",
    "hero.title":"AI koji pretvara posetioce sajta u nove klijente.",
    "hero.subtitle":"Infinity AI razgovara sa posetiocima, odgovara na pitanja, kvalifikuje potražnju i šalje vruće leadove vašem prodajnom timu 24/7.",
    "hero.cta":"Pokreni demo","hero.secondary":"Pogledaj cene",
    "stats.leads":"leadova danas","stats.chats":"AI razgovora","stats.conversion":"konverzija",
    "chat.send":"Pošalji","crm.title":"Live CRM","crm.subtitle":"Novi leadovi",
    "properties.kicker":"Demo za nekretnine","properties.title":"AI trenutno preporučuje relevantne nekretnine","properties.subtitle":"Prvi demo scenario je AI konsultant za agencije za nekretnine u Novom Sadu.",
    "how.kicker":"Kako radi","how.title":"Jedan widget. Ceo ciklus generisanja leadova.",
    "how.step1.title":"Instalacija jednom linijom","how.step1.text":"Widget se dodaje na bilo koji sajt jednim script tagom.",
    "how.step2.title":"AI započinje razgovor","how.step2.text":"Posetioci dobijaju odgovore odmah, bez čekanja menadžera.",
    "how.step3.title":"Kvalifikacija leada","how.step3.text":"AI pita budžet, lokaciju, rok i nameru kupca.",
    "how.step4.title":"Prodaja dobija lead","how.step4.text":"Kontakti se šalju u CRM, email, Telegram ili n8n.",
    "analytics.kicker":"Analitika","analytics.title":"Vidite šta se dešava u prodajnom levku","analytics.text":"Pratite razgovore, leadove, konverziju i vreme odgovora iz jednog čistog dashboarda.",
    "pricing.kicker":"Cene","pricing.title":"Jednostavne cene za brz start",
    "pricing.starter":"Za male biznise koji počinju sa AI leadovima.",
    "pricing.business":"Za aktivne timove kojima trebaju automatizacija i integracije.",
    "pricing.enterprise":"Custom workflow, integracije i onboarding.",
    "pricing.button":"Start","pricing.popular":"Najpopularnije","pricing.custom":"Po dogovoru","pricing.contact":"Kontakt",
    "faq.title":"Pitanja koja klijenti obično postavljaju",
    "faq.q1":"Da li radi na bilo kom sajtu?","faq.a1":"Da. Widget se instalira jednim script tagom.",
    "faq.q2":"Da li leadovi mogu u CRM ili n8n?","faq.a2":"Da. Demo je spreman za n8n, CRM i Supabase integracije.",
    "faq.q3":"Da li može za druge industrije?","faq.a3":"Da. Nekretnine su prvi scenario. Ista platforma može raditi za klinike, advokate, restorane, hotele i druge niše.",
    "cta.title":"Spremni da pretvorite posete sajtu u prodaju?",
    "cta.text":"Pokažite klijentima AI prodajnog asistenta koji radi, umesto da ga objašnjavate rečima.",
    "cta.button":"Otvori demo",
    "footer.text":"Demo platforma za sutrašnju prodaju."
  }
};

let activeLang = localStorage.getItem("infinity_lang") || window.INFINITY_CONFIG?.defaultLanguage || "en";

function t(key){ return I18N[activeLang]?.[key] || I18N.en[key] || key; }

function applyLanguage(lang){
  activeLang = lang;
  localStorage.setItem("infinity_lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  document.querySelectorAll(".lang-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
  window.dispatchEvent(new CustomEvent("languageChanged", {detail:{lang}}));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang-btn").forEach(btn => btn.addEventListener("click", () => applyLanguage(btn.dataset.lang)));
  applyLanguage(activeLang);
});
