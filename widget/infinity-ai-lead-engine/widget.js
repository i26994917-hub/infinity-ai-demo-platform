window.InfinityAI = {
  apiKey: null,
  visitorId: null,
  sessionId: null,
  autoOpenDelay: 3000,
  state: {},

  init: function(config) {
    this.apiKey = config.apiKey;
    this.autoOpenDelay = config.autoOpenDelay || 3000;

    // Постоянный ID посетителя
    this.visitorId = localStorage.getItem('infinity_ai_visitor_id');

    if (!this.visitorId) {
      this.visitorId =
        'visitor-' +
        Date.now() +
        '-' +
        Math.floor(Math.random() * 100000);

      localStorage.setItem(
        'infinity_ai_visitor_id',
        this.visitorId
      );
    }

    // Новый ID каждой сессии
    this.sessionId =
      'session-' +
      Date.now() +
      '-' +
      Math.floor(Math.random() * 100000);

    this.resetState();

    WidgetUI.create();

    var button = document.querySelector('.infinity-ai-button');
    var self = this;

    button.onclick = function() {
      WidgetUI.toggle();

      if (!self.state.started) {
        self.start();
      }
    };

    setTimeout(function() {
      WidgetUI.open();

      if (!self.state.started) {
        self.start();
      }
    }, this.autoOpenDelay);
  },

  resetState: function() {
    this.state = {
      started: false,
      requestType: '',
      budget: 0,
      rooms: 0,
      district: '',
      propertiesCount: 0,
      preferences: '',
      propertyType: '',
      ai: {}
    };
  },

  start: function() {
    this.state.started = true;
    WidgetUI.setMessages(Messages.start());
  },

  chooseType: function(type) {
    this.state.requestType = type;

    if (type === 'buy') {
      BuyFlow.start();
      return;
    }

    if (type === 'sell') {
      SellFlow.start();
      return;
    }

    if (type === 'rent') {
      RentFlow.start();
      return;
    }

    if (type === 'let') {
      LetFlow.start();
      return;
    }

    if (type === 'other') {
      OtherFlow.start();
      return;
    }
  }
};