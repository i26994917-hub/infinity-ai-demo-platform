window.Forms = {
  contactForm: function() {
    return '' +
      '<h3>Odlično.</h3>' +
      '<p>Ostavite kontakt i naš stručnjak će vam se javiti.</p>' +

      '<input id="leadName" placeholder="Vaše ime" style="width:100%;padding:10px;"><br><br>' +

      '<select id="messenger" onchange="Forms.renderContactFields()" style="width:100%;padding:10px;">' +
      '<option value="WhatsApp">WhatsApp</option>' +
      '<option value="Telegram">Telegram</option>' +
      '<option value="Viber">Viber</option>' +
      '</select><br><br>' +

      '<div id="contactFields"></div>' +

      '<button class="infinity-ai-primary" onclick="ContactFlow.saveLead()">Pošalji zahtev</button>';
  },

  renderContactFields: function() {
    var messenger = document.getElementById('messenger').value;
    var box = document.getElementById('contactFields');

    if (messenger === 'WhatsApp') {
      box.innerHTML =
        '<input id="contact" placeholder="WhatsApp broj, npr. +381601234567" style="width:100%;padding:10px;"><br><br>' +
        '<input id="telegramUsername" type="hidden" value="">';
      return;
    }

    if (messenger === 'Telegram') {
      box.innerHTML =
        '<input id="telegramUsername" placeholder="Telegram username, npr. @username" style="width:100%;padding:10px;"><br><br>' +
        '<input id="contact" placeholder="Broj telefona, npr. +381601234567" style="width:100%;padding:10px;"><br><br>';
      return;
    }

    if (messenger === 'Viber') {
      box.innerHTML =
        '<input id="contact" placeholder="Viber broj, npr. +381601234567" style="width:100%;padding:10px;"><br><br>' +
        '<input id="telegramUsername" type="hidden" value="">';
      return;
    }
  },

  showContactForm: function() {
    WidgetUI.setMessages(this.contactForm());
    this.renderContactFields();
  }
};
