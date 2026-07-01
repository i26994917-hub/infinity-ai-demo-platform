window.AIChatFlow = {
  maxQuestions: 3,

  texts: {
    sr: {
      thinking: '🤖 Razmišljam...',
      searching: '🔍 Tražim odgovarajuće objekte...',
      searchError: '❌ Došlo je do greške pri pretrazi objekata.',
      generalError: '❌ Došlo je do greške. Molimo pokušajte ponovo.',
      enterQuestion: 'Unesite pitanje',
      enterAnswer: 'Unesite odgovor',
      budgetQuestion: 'Koliki budžet planirate?',
      roomsQuestion: 'Koliko soba vam je potrebno?',
      districtQuestion: 'Koji deo grada vas interesuje?',
      otherImportantQuestion: 'Da li imate još neki važan zahtev?',
      yourAnswer: 'Vaš odgovor...',
      continue: 'Nastavi',
      foundPrefix: '✅ Pronašao sam ',
      foundSuffix: ' objekata.',
      foundContact: 'Ostavite kontakt i naš agent će vam odmah poslati kompletnu ponudu.',
      thanksTitle: '✅ Hvala na informacijama.',
      thanksContact: 'Ostavite kontakt i naš agent će vam se uskoro javiti.',
      notImportant: 'nije presudno'
    },

    en: {
      thinking: '🤖 Thinking...',
      searching: '🔍 Searching for suitable properties...',
      searchError: '❌ There was an error while searching properties.',
      generalError: '❌ Something went wrong. Please try again.',
      enterQuestion: 'Please enter your question',
      enterAnswer: 'Please enter your answer',
      budgetQuestion: 'What budget are you planning?',
      roomsQuestion: 'How many rooms do you need?',
      districtQuestion: 'Which part of the city are you interested in?',
      otherImportantQuestion: 'Do you have any other important requirement?',
      yourAnswer: 'Your answer...',
      continue: 'Continue',
      foundPrefix: '✅ I found ',
      foundSuffix: ' properties.',
      foundContact: 'Leave your contact and our agent will send you the full offer.',
      thanksTitle: '✅ Thank you for the information.',
      thanksContact: 'Leave your contact and our agent will contact you shortly.',
      notImportant: 'not important'
    }
  },

  lang: function() {
    return (
      window.InfinitySettings &&
      window.InfinitySettings.language
    ) || document.documentElement.lang || 'sr';
  },

  text: function(key) {
    var lang = this.lang();

    if (this.texts[lang] && this.texts[lang][key]) {
      return this.texts[lang][key];
    }

    if (this.texts.sr[key]) {
      return this.texts.sr[key];
    }

    return key;
  },

  sendFirstMessage: async function() {
    var input = document.getElementById('aiFreeMessage');
    var message = input ? input.value : '';

    if (!message) {
      alert(this.text('enterQuestion'));
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
      alert(this.text('enterAnswer'));
      return;
    }

    await this.processMessage(message, InfinityAI.state.ai || {});
  },

  processMessage: async function(message, previousState) {
  WidgetUI.setMessages('<p>' + this.text('thinking') + '</p>');

  try {
    /*
      1. Сначала локально извлекаем параметры из сообщения,
      НЕ дожидаясь AI Brain.
      Это нужно, чтобы поиск запускался стабильно на SR и EN.
    */
    this.applyAIState(
      {
        intent: 'buy'
      },
      message,
      previousState || {}
    );

    /*
      2. Если уже есть бюджет + комнаты,
      сразу запускаем поиск по базе.
    */
    if (this.shouldRunSearch({ intent: 'buy' })) {
      await this.runSearchOnly();

      return this.askContactFromAI({
        intent: 'buy',
        preferences: InfinityAI.state.preferences || message
      });
    }

    /*
      3. Если данных пока недостаточно,
      тогда уже обращаемся к AI Brain,
      чтобы он задал уточняющий вопрос.
    */
    const ai = await AIBrainService.send(message, previousState || {});

    this.applyAIState(ai || {}, message, previousState || {});

    /*
      4. После ответа AI снова проверяем:
      появились ли бюджет + комнаты.
    */
    if (this.shouldRunSearch({ intent: 'buy' })) {
      await this.runSearchOnly();

      return this.askContactFromAI({
        intent: 'buy',
        preferences: InfinityAI.state.preferences || message
      });
    }

    var nextQuestion = this.localizeQuestion((ai && ai.next_question) || '');

    if (nextQuestion && this.canAskMoreQuestions()) {
      this.incrementQuestionCount();

      return this.askNextQuestion({
        next_question: nextQuestion
      });
    }

    if (this.canAskMoreQuestions()) {
      this.incrementQuestionCount();

      return this.askNextQuestion({
        next_question: this.getRequiredQuestion()
      });
    }

    return this.askContactFromAI(ai || {});

  } catch (e) {
    console.error(e);
    WidgetUI.setMessages('<p>' + this.text('generalError') + '</p>');
  }
},

      var nextQuestion = this.localizeQuestion((ai && ai.next_question) || '');

      if (nextQuestion && this.canAskMoreQuestions()) {
        this.incrementQuestionCount();

        return this.askNextQuestion({
          next_question: nextQuestion
        });
      }

      if (this.isQualifiedForContact(ai || {})) {
        return this.askContactFromAI(ai || {});
      }

      if (this.canAskMoreQuestions()) {
        this.incrementQuestionCount();

        var question = this.getRequiredQuestion();

        return this.askNextQuestion({
          next_question: question
        });
      }

      return this.askContactFromAI(ai || {});

    } catch (e) {
      console.error(e);
      WidgetUI.setMessages('<p>' + this.text('generalError') + '</p>');
    }
  },

  getRequiredQuestion: function() {
    if (!InfinityAI.state.budget) {
      return this.text('budgetQuestion');
    }

    if (!InfinityAI.state.rooms && !InfinityAI.state.roomsNotImportant) {
      return this.text('roomsQuestion');
    }

    if (!InfinityAI.state.district) {
      return this.text('districtQuestion');
    }

    return this.text('otherImportantQuestion');
  },

  localizeQuestion: function(question) {
    var lang = this.lang();
    var q = (question || '').toString();
    var lower = q.toLowerCase();

    if (!q) return '';

    if (lang !== 'en') {
      return q;
    }

    if (
      lower.includes('budžet') ||
      lower.includes('budzet') ||
      lower.includes('бюджет')
    ) {
      return this.text('budgetQuestion');
    }

    if (
      lower.includes('koliko soba') ||
      lower.includes('broj soba') ||
      lower.includes('soba') ||
      lower.includes('комнат')
    ) {
      return this.text('roomsQuestion');
    }

    if (
      lower.includes('deo grada') ||
      lower.includes('koji deo') ||
      lower.includes('lokacija') ||
      lower.includes('район')
    ) {
      return this.text('districtQuestion');
    }

    if (
      lower.includes('još neki') ||
      lower.includes('jos neki') ||
      lower.includes('važan zahtev') ||
      lower.includes('vazan zahtev')
    ) {
      return this.text('otherImportantQuestion');
    }

    return q;
  },

  applyAIState: function(ai, userMessage, previous) {
    ai = ai || {};
    previous = previous || {};

    var lowerMessage = (userMessage || '').toString().toLowerCase();

    var looksLikePropertySearch =
      lowerMessage.includes('stan') ||
      lowerMessage.includes('stana') ||
      lowerMessage.includes('nekretn') ||
      lowerMessage.includes('kupujem') ||
      lowerMessage.includes('kupiti') ||
      lowerMessage.includes('tražim') ||
      lowerMessage.includes('trazim') ||
      lowerMessage.includes('apartment') ||
      lowerMessage.includes('flat') ||
      lowerMessage.includes('house') ||
      lowerMessage.includes('property') ||
      lowerMessage.includes('looking for') ||
      lowerMessage.includes('buy');

    var roomsNotImportant =
      lowerMessage.includes('не важно') ||
      lowerMessage.includes('не имеет значения') ||
      lowerMessage.includes('без разницы') ||
      lowerMessage.includes('nije bitno') ||
      lowerMessage.includes('nije važno') ||
      lowerMessage.includes('svejedno') ||
      lowerMessage.includes('bilo koji') ||
      lowerMessage.includes('does not matter') ||
      lowerMessage.includes('not important') ||
      lowerMessage.includes('any rooms') ||
      lowerMessage.includes('any number');

    InfinityAI.state.requestType =
      ai.intent ||
      previous.intent ||
      InfinityAI.state.requestType ||
      'unknown';

    if (
      InfinityAI.state.requestType === 'unknown' ||
      !InfinityAI.state.requestType
    ) {
      if (looksLikePropertySearch) {
        InfinityAI.state.requestType = 'buy';
      }
    }

    InfinityAI.state.budget =
      this.normalizeBudget(ai.budget) ||
      this.normalizeBudget(ai.price) ||
      this.normalizeBudget(previous.budget) ||
      this.normalizeBudget(previous.price) ||
      this.normalizeBudget(InfinityAI.state.budget) ||
      this.extractBudget(userMessage) ||
      0;

    if (roomsNotImportant) {
      InfinityAI.state.rooms = 0;
      InfinityAI.state.roomsNotImportant = true;
    } else {
      InfinityAI.state.rooms =
        this.normalizeRooms(ai.rooms) ||
        this.normalizeRooms(previous.rooms) ||
        this.normalizeRooms(InfinityAI.state.rooms) ||
        this.extractRooms(userMessage) ||
        0;
    }

    var normalizedAIDistrict = this.normalizeDistrict(ai.district);
    var normalizedPreviousDistrict = this.normalizeDistrict(previous.district);
    var normalizedCurrentDistrict = this.normalizeDistrict(InfinityAI.state.district);
    var normalizedMessageDistrict = this.extractDistrict(userMessage);

    InfinityAI.state.district =
      normalizedAIDistrict ||
      normalizedPreviousDistrict ||
      normalizedCurrentDistrict ||
      normalizedMessageDistrict ||
      '';

    var oldPreferences =
      InfinityAI.state.preferences ||
      previous.preferences ||
      '';

    var newPreferences =
      ai.preferences ||
      userMessage ||
      '';

    InfinityAI.state.preferences =
      (oldPreferences + '\n' + newPreferences).trim();

    InfinityAI.state.ai = {
      intent: InfinityAI.state.requestType,
      budget: InfinityAI.state.budget,
      price: ai.price || previous.price || null,
      rooms: InfinityAI.state.rooms,
      district: InfinityAI.state.district,
      property_type:
        ai.property_type ||
        previous.property_type ||
        this.extractPropertyType(userMessage) ||
        null,
      preferences: InfinityAI.state.preferences,
      missing_fields: ai.missing_fields || [],
      next_question: ai.next_question || '',
      ready_for_search: ai.ready_for_search || false,
      ready_for_contact: ai.ready_for_contact || false
    };
  },

  normalizeBudget: function(value) {
    if (!value) return 0;

    if (typeof value === 'number') {
      return value >= 10000 ? value : 0;
    }

    return this.extractBudget(String(value));
  },

  extractBudget: function(message) {
    var text = (message || '').toString().toLowerCase();

    var kMatch = text.match(/(\d+(?:[.,]\d+)?)\s*k/);
    if (kMatch) {
      return Math.round(Number(kMatch[1].replace(',', '.')) * 1000);
    }

    var numbers = text.match(/\d[\d\s.,]*/g);

    if (!numbers) return 0;

    for (var i = 0; i < numbers.length; i++) {
      var n = Number(
        numbers[i]
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(/,/g, '')
      );

      if (!isNaN(n) && n >= 10000) return n;
    }

    return 0;
  },

  normalizeRooms: function(value) {
    if (!value) return 0;

    if (typeof value === 'number') {
      return value > 0 && value <= 10 ? value : 0;
    }

    return this.extractRooms(String(value));
  },

  extractRooms: function(message) {
    var text = (message || '').toString().toLowerCase();

    if (
      text.includes('jednosoban') ||
      text.includes('jedna soba') ||
      text.includes('однособ') ||
      text.includes('1 sob') ||
      text.includes('one bedroom') ||
      text.includes('one-bedroom') ||
      text.includes('1 bedroom') ||
      text.includes('1-bedroom')
    ) return 1;

    if (
      text.includes('dvosoban') ||
      text.includes('dve sobe') ||
      text.includes('двухкомнат') ||
      text.includes('2 sob') ||
      text.includes('two bedroom') ||
      text.includes('two-bedroom') ||
      text.includes('2 bedroom') ||
      text.includes('2-bedroom')
    ) return 2;

    if (
      text.includes('trosoban') ||
      text.includes('tri sobe') ||
      text.includes('трехкомнат') ||
      text.includes('трёхкомнат') ||
      text.includes('3 sob') ||
      text.includes('three bedroom') ||
      text.includes('three-bedroom') ||
      text.includes('3 bedroom') ||
      text.includes('3-bedroom')
    ) return 3;

    if (
      text.includes('four bedroom') ||
      text.includes('four-bedroom') ||
      text.includes('4 bedroom') ||
      text.includes('4-bedroom') ||
      text.includes('četvorosoban') ||
      text.includes('cetvorosoban')
    ) return 4;

    var numbers = text.match(/\d[\d\s.,]*/g);
    if (!numbers) return 0;

    for (var i = 0; i < numbers.length; i++) {
      var n = Number(
        numbers[i]
          .replace(/\s/g, '')
          .replace(/\./g, '')
          .replace(/,/g, '')
      );

      if (!isNaN(n) && n > 0 && n <= 10) return n;
    }

    return 0;
  },

  normalizeDistrict: function(value) {
    var text = (value || '').toString().toLowerCase();

    if (!text) return '';

    if (
      text.includes('centar') ||
      text.includes('center') ||
      text.includes('centre') ||
      text.includes('центр')
    ) {
      return 'NOVI SAD CENTAR';
    }

    if (text.includes('liman') || text.includes('лиман')) {
      return 'NOVI SAD LIMAN';
    }

    if (text.includes('telep') || text.includes('телеп')) {
      return 'NOVI SAD TELEP';
    }

    if (text.includes('podbara') || text.includes('подбара')) {
      return 'NOVI SAD PODBARA';
    }

    if (text.includes('detelinara') || text.includes('детелинара')) {
      return 'NOVI SAD DETELINARA';
    }

    if (text.includes('grbavica')) {
      return 'NOVI SAD GRBAVICA';
    }

    if (text.includes('novo naselje')) {
      return 'NOVI SAD NOVO NASELJE';
    }

    if (
      text.includes('novi sad') ||
      text.includes('novom sadu') ||
      text.includes('нови сад') ||
      text.includes('новом саду') ||
      text.includes('noi sad')
    ) {
      return 'NOVI SAD';
    }

    return value || '';
  },

  extractDistrict: function(message) {
    return this.normalizeDistrict(message);
  },

  extractPropertyType: function(message) {
    var text = (message || '').toString().toLowerCase();

    if (
      text.includes('квартир') ||
      text.includes('stan') ||
      text.includes('stana') ||
      text.includes('apartment') ||
      text.includes('flat')
    ) {
      return 'apartment';
    }

    if (
      text.includes('дом') ||
      text.includes('kuća') ||
      text.includes('kuca') ||
      text.includes('house')
    ) {
      return 'house';
    }

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
  if (InfinityAI.state.searchDone) return false;

  var hasSearchParams = Boolean(
    InfinityAI.state.budget &&
    (InfinityAI.state.rooms || InfinityAI.state.roomsNotImportant)
  );

  return hasSearchParams;
},

  runSearchOnly: async function() {
    if (InfinityAI.state.searchDone) return;

    WidgetUI.setMessages('<p>' + this.text('searching') + '</p>');

    try {
      const searchParams = {
        budget: InfinityAI.state.budget,
        district: InfinityAI.state.district
      };

      if (!InfinityAI.state.roomsNotImportant && InfinityAI.state.rooms) {
        searchParams.rooms = InfinityAI.state.rooms;
      }

      const data = await PropertySearchService.search(searchParams);

      var count = 0;

      if (Array.isArray(data)) {
        count = data.length;
      } else if (data && Array.isArray(data.data)) {
        count = data.data.length;
      } else if (data && typeof data.count === 'number') {
        count = data.count;
      }

      InfinityAI.state.propertiesCount = count;
      InfinityAI.state.searchDone = true;

    } catch (e) {
      console.error(e);
      WidgetUI.setMessages('<p>' + this.text('searchError') + '</p>');
    }
  },

  askNextQuestion: function(ai) {
    ai = ai || {};

    var foundText = '';

    if (InfinityAI.state.searchDone) {
      foundText =
        '<h3>' +
        this.text('foundPrefix') +
        InfinityAI.state.propertiesCount +
        this.text('foundSuffix') +
        '</h3>';
    }

    WidgetUI.setMessages(
      foundText +
      '<p><b>' + this.localizeQuestion(ai.next_question || this.getRequiredQuestion()) + '</b></p>' +
      '<textarea id="aiFollowupMessage" placeholder="' + this.text('yourAnswer') + '" style="width:100%;height:80px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="AIChatFlow.sendFollowup()">' + this.text('continue') + '</button>'
    );
  },

  isQualifiedForContact: function(ai) {
    ai = ai || {};

    var intent = (
      ai.intent ||
      InfinityAI.state.requestType ||
      ''
    ).toString().toLowerCase();

    if (
      intent === 'buy' ||
      intent.includes('buy') ||
      intent.includes('property') ||
      intent.includes('apartment') ||
      intent.includes('stan') ||
      intent.includes('nekretn')
    ) {
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
    ai = ai || {};

    var roomsText = InfinityAI.state.roomsNotImportant
      ? this.text('notImportant')
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
        '<h3>' +
        this.text('foundPrefix') +
        '<b>' + (InfinityAI.state.propertiesCount || 0) + '</b>' +
        this.text('foundSuffix') +
        '</h3>' +
        '<p>' + this.text('foundContact') + '</p>';
    } else {
      foundBlock =
        '<h3>' + this.text('thanksTitle') + '</h3>' +
        '<p>' + this.text('thanksContact') + '</p>';
    }

    WidgetUI.setMessages(foundBlock);

    setTimeout(function() {
      ContactFlow.show(preferences);
    }, 800);
  }
};