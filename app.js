const DATA = {
  properties: [
    {icon:"🏢", title:{en:"Modern apartment near Liman",sr:"Moderan stan kod Limana"}, location:"Novi Sad · Liman", area:87, rooms:3, price:149900},
    {icon:"🏡", title:{en:"Family house with garden",sr:"Porodična kuća sa dvorištem"}, location:"Novi Sad · Telep", area:155, rooms:5, price:239000},
    {icon:"🏙️", title:{en:"Downtown office space",sr:"Poslovni prostor u centru"}, location:"Novi Sad · Centar", area:120, rooms:6, price:319000}
  ],
  leads: [
    {name:"Milan Petrović", need:"Apartment · Novi Sad", budget:"€150,000"},
    {name:"Ana Jovanović", need:"House · Telep", budget:"€240,000"},
    {name:"Marko Ilić", need:"Office · Centar", budget:"€320,000"},
    {name:"Jelena Nikolić", need:"Apartment · Liman", budget:"€118,000"}
  ],
  chat: {
    en: [
      {type:"ai", text:"👋 Welcome! I am Infinity AI."},
      {type:"ai", text:"What are you looking for today?"},
      {type:"user", text:"Apartment in Novi Sad"},
      {type:"ai", text:"Great. What is your budget?"},
      {type:"user", text:"Up to €150,000"},
      {type:"ai", text:"Perfect. I found several relevant options. Leave your phone and an agent will contact you."}
    ],
    sr: [
      {type:"ai", text:"👋 Dobrodošli! Ja sam Infinity AI."},
      {type:"ai", text:"Šta tražite danas?"},
      {type:"user", text:"Stan u Novom Sadu"},
      {type:"ai", text:"Odlično. Koji je vaš budžet?"},
      {type:"user", text:"Do €150,000"},
      {type:"ai", text:"Savršeno. Pronašao sam nekoliko relevantnih opcija. Ostavite telefon i agent će vas kontaktirati."}
    ]
  },
  quick: {
    en:["Buy property","Sell property","Book viewing","Ask AI"],
    sr:["Kupovina","Prodaja","Zakazivanje","Pitaj AI"]
  }
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function msg(type, text){
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function typing(){
  const box = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "msg ai typing";
  div.innerHTML = "<b></b><b></b><b></b>";
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

async function runChat(){
  const box = document.getElementById("chatMessages");
  box.innerHTML = "";
  for(const item of DATA.chat[activeLang]){
    if(item.type === "ai"){
      const node = typing();
      await sleep(650);
      node.remove();
    }
    msg(item.type, item.text);
    await sleep(900);
  }
  document.getElementById("leadForm").classList.remove("hidden");
}

function renderQuick(){
  const box = document.getElementById("quickReplies");
  box.innerHTML = DATA.quick[activeLang].map(x => `<button>${x}</button>`).join("");
}

function renderProperties(){
  const grid = document.getElementById("propertyGrid");
  grid.innerHTML = DATA.properties.map(p => `
    <article class="property-card">
      <div class="property-image">${p.icon}</div>
      <div class="property-body">
        <h3>${p.title[activeLang]}</h3>
        <p>${p.location}</p>
        <div class="property-meta">
          <span>${p.area} m²</span>
          <span>${p.rooms} rooms</span>
        </div>
        <div class="property-price">€${p.price.toLocaleString("en-US")}</div>
      </div>
    </article>
  `).join("");
}

function pushLead(lead){
  const stream = document.getElementById("leadStream");
  const el = document.createElement("div");
  el.className = "lead-item";
  el.innerHTML = `<strong>${lead.name}</strong><span>${lead.need}</span><small>${lead.budget} · NEW</small>`;
  stream.prepend(el);
  while(stream.children.length > 4) stream.lastChild.remove();
}

function runLeads(){
  let i = 0;
  DATA.leads.slice(0,3).forEach(pushLead);
  setInterval(() => {
    pushLead(DATA.leads[i % DATA.leads.length]);
    i++;
  }, 4200);
}

function counter(id, target, suffix=""){
  const el = document.getElementById(id);
  let n = 0;
  const step = Math.max(1, Math.ceil(target/55));
  const timer = setInterval(() => {
    n += step;
    if(n >= target){ n = target; clearInterval(timer); }
    el.textContent = n + suffix;
  }, 32);
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuick();
  renderProperties();
  runChat();
  runLeads();
  counter("counterLeads", 27);
  counter("counterChats", 214);
  counter("counterConversion", 18, "%");

  document.getElementById("leadForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = new FormData(e.target).get("name") || "New lead";
    pushLead({name, need:"Website demo", budget:"Qualified"});
    e.target.reset();
    e.target.classList.add("hidden");
    msg("ai", activeLang === "sr" ? "✅ Hvala! Zahtev je poslat agentu." : "✅ Thank you! Your request has been sent to an agent.");
  });
});

window.addEventListener("languageChanged", () => {
  renderQuick();
  renderProperties();
  runChat();
});
