window.ContactFlow = {
  show: function(preferences) {
    InfinityAI.state.preferences = preferences || InfinityAI.state.preferences || '';

    WidgetUI.setMessages(Forms.contactForm());

    setTimeout(function() {
      Forms.renderContactFields();
    }, 50);
  },

  saveLead: async function() {
    var nameInput = document.getElementById('leadName');
    var messengerInput = document.getElementById('messenger');
    var contactInput = document.getElementById('contact');
    var telegramInput = document.getElementById('telegramUsername');

    var name = nameInput ? nameInput.value.trim() : '';
    var messenger = messengerInput ? messengerInput.value : '';
    var contact = contactInput ? contactInput.value.trim() : '';
    var telegramUsername = telegramInput ? telegramInput.value.trim() : '';

    if (!name) {
      alert(
        window.InfinitySettings &&
        window.InfinitySettings.language === 'en'
          ? 'Please enter your name'
          : 'Unesite ime'
      );
      return;
    }

    if (!contact && !telegramUsername) {
      alert(
        window.InfinitySettings &&
        window.InfinitySettings.language === 'en'
          ? 'Please enter your contact'
          : 'Unesite kontakt'
      );
      return;
    }

    var roomsText = InfinityAI.state.roomsNotImportant
      ? (
          window.InfinitySettings &&
          window.InfinitySettings.language === 'en'
            ? 'not important'
            : 'nije presudno'
        )
      : (InfinityAI.state.rooms || '');

    var dialogText =
      InfinityAI.state.dialogText ||
      InfinityAI.state.preferences ||
      '';

    var payload = {
      lead_name: name,
      name: name,

      messenger: messenger,
      contact: contact,
      phone: contact,

      telegram_username: telegramUsername,

      preferences: InfinityAI.state.preferences || '',
      message: InfinityAI.state.preferences || '',
      Message: InfinityAI.state.preferences || '',

      dialog: dialogText,
      chat_dialog: dialogText,
      conversation: dialogText,

      budget: InfinityAI.state.budget || 0,
      Budget: InfinityAI.state.budget || 0,

      rooms: InfinityAI.state.rooms || 0,
      Rooms: roomsText,

      district: InfinityAI.state.district || '',
      District: InfinityAI.state.district || '',

      properties_count: InfinityAI.state.propertiesCount || 0,

      visitor_id: InfinityAI.visitorId || '',
      visitorId: InfinityAI.visitorId || '',

      session_id: InfinityAI.sessionId || '',
      sessionId: InfinityAI.sessionId || '',

      request_type: InfinityAI.state.requestType || 'buy',
      intent: InfinityAI.state.requestType || 'buy',

      language:
        window.InfinitySettings &&
        window.InfinitySettings.language
          ? window.InfinitySettings.language
          : 'sr'
    };

    WidgetUI.setMessages(
      '<p>' +
      (
        window.InfinitySettings &&
        window.InfinitySettings.language === 'en'
          ? 'Sending request...'
          : 'Šaljem zahtev...'
      ) +
      '</p>'
    );

    try {
      await SaveLeadService.save(payload);

      WidgetUI.setMessages(Messages.thanks());

    } catch (e) {
      console.error(e);
      WidgetUI.setMessages(Messages.error());
    }
  }
};