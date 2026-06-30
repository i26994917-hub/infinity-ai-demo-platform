window.InfinitySettings = {
  language: 'sr',
  agencyName: 'House Nekretnine'
};

window.I18N = {
  sr: {
    widgetHeader: 'AI konsultant za nekretnine',
    startTitle: 'Zdravo! Kako mogu da vam pomognem?',
    textareaPlaceholder: 'Napišite šta tražite, na primer: Tražim trosoban stan do 170000 evra na Limanu...',
    sendQuestion: 'Pošalji pitanje',
    chooseOption: 'Ili izaberite jednu od opcija:',
    buy: 'Želim da kupim stan/kuću',
    sell: 'Želim da prodam stan/kuću',
    rent: 'Želim da iznajmim stan/kuću',
    let: 'Želim da izdam stan/kuću',
    other: 'Imam drugo pitanje',
    thanksTitle: '✅ Hvala!',
    thanksText1: 'Vaš zahtev je primljen.',
    thanksText2: 'Naš stručnjak će vam se uskoro javiti.',
    error: '❌ Nije moguće poslati zahtev. Molimo pokušajte ponovo.'
  },

  en: {
    widgetHeader: 'AI real estate consultant',
    startTitle: 'Hi! How can I help you?',
    textareaPlaceholder: 'Write what you are looking for, for example: I am looking for a 3-room apartment up to €170,000 in Liman...',
    sendQuestion: 'Send question',
    chooseOption: 'Or choose one of the options:',
    buy: 'I want to buy an apartment/house',
    sell: 'I want to sell an apartment/house',
    rent: 'I want to rent an apartment/house',
    let: 'I want to rent out an apartment/house',
    other: 'I have another question',
    thanksTitle: '✅ Thank you!',
    thanksText1: 'Your request has been received.',
    thanksText2: 'Our specialist will contact you soon.',
    error: '❌ Unable to send request. Please try again.'
  }
};

window.t = function(key) {
  const lang = window.InfinitySettings?.language || 'sr';
  return window.I18N[lang]?.[key] || window.I18N.sr[key] || key;
};