window.ContactFlow = {
  show: function(preferences) {
    InfinityAI.state.preferences = preferences;
    Forms.showContactForm();
  },

  saveLead: async function() {
    var leadName = document.getElementById('leadName').value;
    var messenger = document.getElementById('messenger').value;
    var contact = document.getElementById('contact').value;
    var telegramUsername = document.getElementById('telegramUsername').value;

    if (!leadName) {
      alert('Unesite ime');
      return;
    }

    if (messenger === 'Telegram') {
      if (!telegramUsername) {
        alert('Unesite Telegram username');
        return;
      }

      if (telegramUsername.charAt(0) !== '@') {
        alert('Telegram username mora da počinje sa @');
        return;
      }

      if (!contact) {
        alert('Unesite broj telefona');
        return;
      }
    } else {
      if (!contact) {
        alert('Unesite kontakt');
        return;
      }
    }

    try {
      await SaveLeadService.save({
        lead_name: leadName,
        messenger: messenger,
        contact: contact,
        telegram_username: telegramUsername,
        preferences: InfinityAI.state.preferences,
        budget: InfinityAI.state.budget,
        rooms: InfinityAI.state.rooms,
        district: InfinityAI.state.district,
        properties_count: InfinityAI.state.propertiesCount
      });

      WidgetUI.setMessages(Messages.thanks());
    } catch (e) {
      console.error(e);
      WidgetUI.setMessages(Messages.error());
    }
  }
};
