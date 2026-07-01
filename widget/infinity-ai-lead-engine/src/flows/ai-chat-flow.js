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

    return this.texts.sr[key] || key;
  },

  ensureState: function() {
    if (!window.InfinityAI) return;

    if (!InfinityAI.state) {
      InfinityAI.state = {};
    }

    InfinityAI.state.questionCount = InfinityAI.state.questionCount || 0;
    InfinityAI.state.preferences = InfinityAI.state.preferences || '';
    InfinityAI.state.requestType = InfinityAI.state.requestType || 'buy';
  },

  sendFirstMessage: async function() {
    this.ensureState();

    var input = document.getElementById('aiFreeMessage');
    var message = input ? input.value.trim() : '';

    if (!message) {
      alert(this.text('enterQuestion'));
      return;
    }

    InfinityAI.state.questionCount = 0;
    InfinityAI.state.searchDone = false;
    InfinityAI.state.roomsNotImportant = false;
    InfinityAI.state.preferences = '';
    InfinityAI.state.requestType = 'buy';

    await this.processMessage(message, {});
  },

  sendFollowup: async function() {
    this.ensureState();

    var input = document.getElementById('aiFollowupMessage');
    var message = input ? input.value.trim() : '';

    if (!message) {
      alert(this.text('enterAnswer'));
      return;
    }

    await this.processMessage(message, InfinityAI.state.ai || {});
  },

  processMessage: async function(message, previousState) {
    this.ensureState();

    WidgetUI.setMessages('<p>' + this.text('thinking') + '</p>');

    try {
      this.applyMessage(message);

      if (this.shouldRunSearch()) {
        await this.runSearchOnly();

        return this.askContactFromAI({
          intent: 'buy',
          preferences: InfinityAI.state.preferences || message
        });
      }

      var ai = null;

      try {
        if (window.AIBrainService && typeof AIBrainService.send === 'function') {
          ai = await AIBrainService.send(message, previousState || {});
        }
      } catch (aiError) {
        console.warn('AI Brain error, using local flow:', aiError);
      }

      if (ai) {
        this.applyAI(ai, message, previousState || {});
      }

      if (this.shouldRunSearch()) {
        await this.runSearchOnly();

        return this.askContactFromAI({
          intent: 'buy',
          preferences: InfinityAI.state.preferences || message
        });
      }

      if (this.canAskMoreQuestions()) {
        this.incrementQuestionCount();

        return this.askNextQuestion({
          next_question: this.getRequiredQuestion()
        });
      }

      return this.askContactFromAI({
        intent: 'buy',
        preferences: InfinityAI.state.preferences || message
      });

    } catch (e) {
      console.error(e);
      WidgetUI.setMessages('<p>' + this.text('generalError') + '</p>');
    }
  },

  applyAI: function(ai, userMessage, previous) {
    ai = ai || {};
    previous = previous || {};

    if (ai.intent) {
      InfinityAI.state.requestType = ai.intent;
    }

    var aiBudget =
      this.normalizeBudget(ai.budget) ||
      this.normalizeBudget(ai.price) ||
      this.normalizeBudget(previous.budget) ||
      this.normalizeBudget(previous.price);

    if (aiBudget && !InfinityAI.state.budget) {
      InfinityAI.state.budget = aiBudget;
    }

    var aiRooms =
      this.normalizeRooms(ai.rooms) ||
      this.normalizeRooms(previous.rooms);

    if (aiRooms && !InfinityAI.state.rooms) {
      InfinityAI.state.rooms = aiRooms;
    }

    var aiDistrict =
      this.normalizeDistrict(ai.district) ||
      this.normalizeDistrict(previous.district);

    if (aiDistrict && !InfinityAI.state.district) {
      InfinityAI.state.district = aiDistrict;
    }

    if (ai.preferences) {
      InfinityAI.state.preferences =
        (InfinityAI.state.preferences + '\n' + ai.preferences).trim();
    }

    InfinityAI.state.ai = {
      intent: InfinityAI.state.requestType || 'buy',
      budget: InfinityAI.state.budget || 0,
      rooms: InfinityAI.state.rooms || 0,
      district: InfinityAI.state.district || '',
      preferences: InfinityAI.state.preferences || '',
      next_question: ai.next_question || ''
    };
  },

  applyMessage: function(message) {
    var text = (message || '').toString();
    var lower = text.toLowerCase();

    var looksLikePropertySearch =
      lower.includes('stan') ||
      lower.includes('stana') ||
      lower.includes('nekretn') ||
      lower.includes('kupujem') ||
      lower.includes('kupiti') ||
      lower.includes('tražim') ||
      lower.includes('trazim') ||
      lower.includes('apartment') ||
      lower.includes('flat') ||
      lower.includes('house') ||
      lower.includes('property') ||
      lower.includes('looking for') ||
      lower.includes('buy');

    if (looksLikePropertySearch) {
      InfinityAI.state.requestType = 'buy';
    }

    var roomsNotImportant =
      lower.includes('nije bitno') ||
      lower.includes('nije važno') ||
      lower.includes('nije vazno') ||
      lower.includes('svejedno') ||
      lower.includes('bilo koji') ||
      lower.includes('does not matter') ||
      lower.includes('not important') ||
      lower.includes('any rooms') ||
      lower.includes('any number');

    if (roomsNotImportant) {
      InfinityAI.state.rooms = 0;
      InfinityAI.state.roomsNotImportant = true;
    }

    var budget = this.extractBudget(text);
    var rooms = this.extractRooms(text);
    var district = this.extractDistrict(text);

    if (budget) {
      InfinityAI.state.budget = budget;
    }

    if (rooms && !InfinityAI.state.roomsNotImportant) {
      InfinityAI.state.rooms = rooms;
    }

    if (district) {
      InfinityAI.state.district = district;
    }

    InfinityAI.state.preferences =
      ((InfinityAI.state.preferences || '') + '\n' + text).trim();

    InfinityAI.state.ai = {
      intent: InfinityAI.state.requestType || 'buy',
      budget: InfinityAI.state.budget || 0,
      rooms: InfinityAI.state.rooms || 0,
      district: InfinityAI.state.district || '',
      preferences: InfinityAI.state.preferences || ''
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

      if (!isNaN(n) && n >= 10000) {
        return n;
      }
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
      text.includes('1 sob') ||
      text.includes('one bedroom') ||
      text.includes('one-bedroom') ||
      text.includes('1 bedroom') ||
      text.includes('1-bedroom')
    ) return 1;

    if (
      text.includes('dvosoban') ||
      text.includes('dve sobe') ||
      text.includes('dve soba') ||
      text.includes('2 sob') ||
      text.includes('two bedroom') ||
      text.includes('two-bedroom') ||
      text.includes('2 bedroom') ||
      text.includes('2-bedroom')
    ) return 2;

    if (
      text.includes('trosoban') ||
      text.includes('tri sobe') ||
      text.includes('3 sob') ||
      text.includes('three bedroom') ||
      text.includes('three-bedroom') ||
      text.includes('3 bedroom') ||
      text.includes('3-bedroom')
    ) return 3;

    if (
      text.includes('četvorosoban') ||
      text.includes('cetvorosoban') ||
      text.includes('4 sob') ||
      text.includes('four bedroom') ||
      text.includes('four-bedroom') ||
      text.includes('4 bedroom') ||
      text.includes('4-bedroom')
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

      if (!isNaN(n) && n > 0 && n <= 10) {
        return n;
      }
    }

    return 0;
  },

  normalizeDistrict: function(value) {
    var text = (value || '').toString().toLowerCase();

    if (!text) return '';

    if (
      text.includes('centar') ||
      text.includes('center') ||
      text.includes('centre')
    ) {
      return 'NOVI SAD CENTAR';
    }

    if (text.includes('liman')) {
      return 'NOVI SAD LIMAN';
    }

    if (text.includes('telep')) {
      return 'NOVI SAD TELEP';
    }

    if (text.includes('podbara')) {
      return 'NOVI SAD PODBARA';
    }

    if (text.includes('detelinara')) {
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
      text.includes('novom sadu')
    ) {
      return 'NOVI SAD';
    }

    return '';
  },

  extractDistrict: function(message) {
    return this.normalizeDistrict(message);
  },

  shouldRunSearch: function() {
    if (InfinityAI.state.searchDone) return false;

    var hasBudget = Boolean(InfinityAI.state.budget);

    var hasRooms = Boolean(
      InfinityAI.state.rooms ||
      InfinityAI.state.roomsNotImportant
    );

    return Boolean(hasBudget && hasRooms);
  },

  runSearchOnly: async function() {
  if (InfinityAI.state.searchDone) return;

  WidgetUI.setMessages('<p>' + this.text('searching') + '</p>');

  try {
    /*
      ВАЖНО ДЛЯ ДЕМО:
      Район НЕ отправляем в фильтр поиска, потому что в базе районы могут быть:
      NOVI SAD LIMAN4, NOVI SAD LIMAN 3 и т.д.
      И точный фильтр NOVI SAD LIMAN возвращает 0.
    */

    var searchParams = {
      budget: InfinityAI.state.budget
    };

    if (!InfinityAI.state.roomsNotImportant && InfinityAI.state.rooms) {
      searchParams.rooms = InfinityAI.state.rooms;
    }

    console.log('Infinity AI search params:', searchParams);

    var data = await PropertySearchService.search(searchParams);

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

  askNextQuestion: function(ai) {
    ai = ai || {};

    WidgetUI.setMessages(
      '<p><b>' + (ai.next_question || this.getRequiredQuestion()) + '</b></p>' +
      '<textarea id="aiFollowupMessage" placeholder="' + this.text('yourAnswer') + '" style="width:100%;height:80px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="AIChatFlow.sendFollowup()">' + this.text('continue') + '</button>'
    );
  },

  canAskMoreQuestions: function() {
    InfinityAI.state.questionCount = InfinityAI.state.questionCount || 0;
    return InfinityAI.state.questionCount < this.maxQuestions;
  },

  incrementQuestionCount: function() {
    InfinityAI.state.questionCount = InfinityAI.state.questionCount || 0;
    InfinityAI.state.questionCount++;
  },

  askContactFromAI: function(ai) {
    ai = ai || {};

    var roomsText = InfinityAI.state.roomsNotImportant
      ? this.text('notImportant')
      : (InfinityAI.state.rooms || '-');

    var preferences =
      'Tip zahteva: ' + (ai.intent || InfinityAI.state.requestType || 'buy') + '\n' +
      'Budžet: €' + (InfinityAI.state.budget || '-') + '\n' +
      'Broj soba: ' + roomsText + '\n' +
      'Deo grada: ' + (InfinityAI.state.district || '-') + '\n' +
      'Pronađeno objekata: ' + (InfinityAI.state.propertiesCount || 0) + '\n' +
      'Detalji: ' + (InfinityAI.state.preferences || ai.preferences || '');

    var block = '';

    if (InfinityAI.state.searchDone) {
      block =
        '<h3>' +
        this.text('foundPrefix') +
        '<b>' + (InfinityAI.state.propertiesCount || 0) + '</b>' +
        this.text('foundSuffix') +
        '</h3>' +
        '<p>' + this.text('foundContact') + '</p>';
    } else {
      block =
        '<h3>' + this.text('thanksTitle') + '</h3>' +
        '<p>' + this.text('thanksContact') + '</p>';
    }

    WidgetUI.setMessages(block);

    setTimeout(function() {
      ContactFlow.show(preferences);
    }, 800);
  }
};