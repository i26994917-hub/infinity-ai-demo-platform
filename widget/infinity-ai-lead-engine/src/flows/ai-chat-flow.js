window.AIChatFlow = {
  maxQuestions: 3,

  sendFirstMessage: async function() {
    var input = document.getElementById('aiFreeMessage');
    var message = input ? input.value : '';

    if (!message) {
      alert('Unesite pitanje');
      return;
    }

    InfinityAI.state.questionCount = 0;
    InfinityAI.state.searchDone = false;
    InfinityAI.state.roomsNotImportant = false;

    await this.processMessage(message, {});
  },

  sendFollowup: async function() {
    var input = document.getElementById('aiFollowupMessage');
    var message = input ? input.value : '';

    if (!message) {
      alert('Unesite odgovor');
      return;
    }

    await this.processMessage(message, InfinityAI.state.ai || {});
  },

  processMessage: async function(message, previousState) {
    WidgetUI.setMessages(
  '<p>' +
  (
    window.InfinitySettings &&
    window.InfinitySettings.language === 'en'
      ? '🤖 Thinking...'
      : '🤖 Razmišljam...'
  ) +
  '</p>'
);

    try {
      const ai = await AIBrainService.send(message, previousState || {});

      this.applyAIState(ai, message, previousState);

      if (this.shouldRunSearch(ai)) {
        await this.runSearchOnly();
      }

      if (ai.next_question && this.canAskMoreQuestions()) {
        this.incrementQuestionCount();
        return this.askNextQuestion(ai);
      }

      if (this.isQualifiedForContact(ai)) {
        return this.askContactFromAI(ai);
      }

      if (this.canAskMoreQuestions()) {
        this.incrementQuestionCount();

        var question = this.getRequiredQuestion();

        return this.askNextQuestion({
          next_question: question
        });
      }

      return this.askContactFromAI(ai);

    } catch (e) {
      console.error(e);
      WidgetUI.setMessages('<p>❌ Došlo je do greške. Molimo pokušajte ponovo.</p>');
    }
  },

  getRequiredQuestion: function() {
    if (!InfinityAI.state.budget) {
      return 'Koliki budžet planirate?';
    }

    if (!InfinityAI.state.rooms && !InfinityAI.state.roomsNotImportant) {
      return 'Koliko soba vam je potrebno?';
    }

    if (!InfinityAI.state.district) {
      return 'Koji deo grada vas interesuje?';
    }

    return 'Da li imate još neki važan zahtev?';
  },

  applyAIState: function(ai, userMessage, previous) {
    previous = previous || {};

    var lowerMessage = (userMessage || '').toLowerCase();

    var roomsNotImportant =
      lowerMessage.includes('не важно') ||
      lowerMessage.includes('не имеет значения') ||
      lowerMessage.includes('без разницы') ||
      lowerMessage.includes('nije bitno') ||
      lowerMessage.includes('nije važno') ||
      lowerMessage.includes('svejedno') ||
      lowerMessage.includes('bilo koji');

    InfinityAI.state.requestType =
      ai.intent || previous.intent || InfinityAI.state.requestType || 'unknown';

    if (
      InfinityAI.state.requestType === 'unknown' &&
      (
        lowerMessage.includes('купить') ||
        lowerMessage.includes('kupiti') ||
        lowerMessage.includes('kupujem') ||
        lowerMessage.includes('tražim stan') ||
        lowerMessage.includes('trazim stan')
      )
    ) {
      InfinityAI.state.requestType = 'buy';
    }

    InfinityAI.state.budget =
      ai.budget ||
      previous.budget ||
      InfinityAI.state.budget ||
      this.extractBudget(userMessage) ||
      0;

    if (roomsNotImportant) {
      InfinityAI.state.rooms = 0;
      InfinityAI.state.roomsNotImportant = true;
    } else {
      InfinityAI.state.rooms =
        ai.rooms ||
        previous.rooms ||
        InfinityAI.state.rooms ||
        this.extractRooms(userMessage) ||
        0;
    }

    InfinityAI.state.district =
      ai.district ||
      previous.district ||
      InfinityAI.state.district ||
      this.extractDistrict(userMessage) ||
      '';

    var oldPreferences =
      InfinityAI.state.preferences || previous.preferences || '';

    var newPreferences =
      ai.preferences || userMessage || '';

    InfinityAI.state.preferences =
      (oldPreferences + '\n' + newPreferences).trim();

    InfinityAI.state.ai = {
      intent: InfinityAI.state.requestType,
      budget: InfinityAI.state.budget,
      price: ai.price || previous.price || null,
      rooms: InfinityAI.state.rooms,
      district: InfinityAI.state.district,
      property_type: ai.property_type || previous.property_type || this.extractPropertyType(userMessage) || null,
      preferences: InfinityAI.state.preferences,
      missing_fields: ai.missing_fields || [],
      next_question: ai.next_question || '',
      ready_for_search: ai.ready_for_search || false,
      ready_for_contact: ai.ready_for_contact || false
    };
  },

  extractBudget: function(message) {
    var text = (message || '').toLowerCase();
    var numbers = text.match(/\d[\d\s.]*/g);

    if (!numbers) return 0;

    for (var i = 0; i < numbers.length; i++) {
      var n = Number(numbers[i].replace(/\s/g, '').replace(/\./g, ''));
      if (!isNaN(n) && n >= 10000) return n;
    }

    return 0;
  },

  extractRooms: function(message) {
    var text = (message || '').toLowerCase();

    if (text.includes('jednosoban') || text.includes('однособ') || text.includes('1 sob')) return 1;
    if (text.includes('dvosoban') || text.includes('двухкомнат') || text.includes('2 sob')) return 2;
    if (text.includes('trosoban') || text.includes('трехкомнат') || text.includes('трёхкомнат') || text.includes('3 sob')) return 3;

    var numbers = text.match(/\d[\d\s.]*/g);
    if (!numbers) return 0;

    for (var i = 0; i < numbers.length; i++) {
      var n = Number(numbers[i].replace(/\s/g, '').replace(/\./g, ''));
      if (!isNaN(n) && n > 0 && n <= 10) return n;
    }

    return 0;
  },

  extractDistrict: function(message) {
    var text = (message || '').toLowerCase();

    if (text.includes('liman') || text.includes('лиман')) return 'NOVI SAD LIMAN';
    if (text.includes('telep') || text.includes('телеп')) return 'NOVI SAD TELEP';
    if (text.includes('podbara') || text.includes('подбара')) return 'NOVI SAD PODBARA';
    if (text.includes('detelinara') || text.includes('детелинара')) return 'NOVI SAD DETELINARA';

    if (
      text.includes('novi sad') ||
      text.includes('novom sadu') ||
      text.includes('нови сад') ||
      text.includes('новом саду') ||
      text.includes('noi sad')
    ) {
      return 'NOVI SAD';
    }

    return '';
  },

  extractPropertyType: function(message) {
    var text = (message || '').toLowerCase();

    if (text.includes('квартир') || text.includes('stan') || text.includes('stana')) return 'apartment';
    if (text.includes('дом') || text.includes('kuća') || text.includes('kuca') || text.includes('house')) return 'house';

    return null;
  },

  canAskMoreQuestions: function() {
    InfinityAI.state.questionCount = InfinityAI.state.questionCount || 0;
    return InfinityAI.state.questionCount < this.maxQuestions;
  },

  incrementQuestionCount: function() {
    InfinityAI.state.questionCount = InfinityAI.state.questionCount || 0;
    InfinityAI.state.questionCount++;
  },

  shouldRunSearch: function(ai) {
    var intent = ai.intent || InfinityAI.state.requestType || '';

    if (intent !== 'buy') return false;
    if (InfinityAI.state.searchDone) return false;

    return Boolean(
      InfinityAI.state.budget &&
      (InfinityAI.state.rooms || InfinityAI.state.roomsNotImportant)
    );
  },

  runSearchOnly: async function() {
    if (InfinityAI.state.searchDone) return;

    WidgetUI.setMessages('<p>🔍 Tražim odgovarajuće objekte...</p>');

    try {
      const searchParams = {
        budget: InfinityAI.state.budget,
        district: InfinityAI.state.district
      };

      if (!InfinityAI.state.roomsNotImportant && InfinityAI.state.rooms) {
        searchParams.rooms = InfinityAI.state.rooms;
      }

      const data = await PropertySearchService.search(searchParams);

      InfinityAI.state.propertiesCount = data.length;
      InfinityAI.state.searchDone = true;

    } catch (e) {
      console.error(e);
      WidgetUI.setMessages('<p>❌ Došlo je do greške pri pretrazi objekata.</p>');
    }
  },

  askNextQuestion: function(ai) {
    var foundText = '';

    if (InfinityAI.state.searchDone) {
      foundText =
        '<h3>✅ Pronašao sam ' +
        InfinityAI.state.propertiesCount +
        ' objekata.</h3>';
    }

    WidgetUI.setMessages(
      foundText +
      '<p><b>' + ai.next_question + '</b></p>' +
      '<textarea id="aiFollowupMessage" placeholder="Vaš odgovor..." style="width:100%;height:80px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="AIChatFlow.sendFollowup()">Nastavi</button>'
    );
  },

  isQualifiedForContact: function(ai) {
    var intent = ai.intent || InfinityAI.state.requestType || '';

    if (intent === 'buy') {
      return Boolean(
        InfinityAI.state.budget &&
        (InfinityAI.state.rooms || InfinityAI.state.roomsNotImportant) &&
        InfinityAI.state.searchDone &&
        InfinityAI.state.questionCount >= this.maxQuestions
      );
    }

    if (intent === 'rent') {
      return Boolean(
        InfinityAI.state.budget &&
        (InfinityAI.state.rooms || InfinityAI.state.roomsNotImportant) &&
        InfinityAI.state.district
      );
    }

    if (intent === 'sell') {
      return Boolean(ai.property_type && ai.price && ai.district);
    }

    if (intent === 'let') {
      return Boolean(ai.property_type && ai.price && ai.district);
    }

    return false;
  },

  askContactFromAI: function(ai) {
    var roomsText = InfinityAI.state.roomsNotImportant
      ? 'nije presudno'
      : (InfinityAI.state.rooms || '-');

    var preferences =
      'Tip zahteva: ' + (ai.intent || InfinityAI.state.requestType || 'other') + '\n' +
      'Budžet: €' + (InfinityAI.state.budget || '-') + '\n' +
      'Broj soba: ' + roomsText + '\n' +
      'Deo grada: ' + (InfinityAI.state.district || '-') + '\n' +
      'Pronađeno objekata: ' + (InfinityAI.state.propertiesCount || 0) + '\n' +
      'Detalji: ' + (InfinityAI.state.preferences || ai.preferences || '');

    var foundBlock = '';

    if (InfinityAI.state.searchDone) {
      foundBlock =
        '<h3>✅ Pronašao sam <b>' +
        (InfinityAI.state.propertiesCount || 0) +
        '</b> odgovarajućih nekretnina.</h3>' +
        '<p>Ostavite kontakt i naš agent će vam odmah poslati kompletnu ponudu.</p>';
    } else {
      foundBlock =
        '<h3>✅ Hvala na informacijama.</h3>' +
        '<p>Ostavite kontakt i naš agent će vam se uskoro javiti.</p>';
    }

    WidgetUI.setMessages(foundBlock);

    setTimeout(function() {
      ContactFlow.show(preferences);
    }, 1500);
  }
};