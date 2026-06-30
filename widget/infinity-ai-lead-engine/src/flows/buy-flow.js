window.BuyFlow = {
  start: function() {
    WidgetUI.setMessages(
      '<p><b>Koji budžet razmatrate?</b></p>' +
      '<button onclick="BuyFlow.selectBudget(100000)">do €100.000</button>' +
      '<button onclick="BuyFlow.selectBudget(150000)">do €150.000</button>' +
      '<button onclick="BuyFlow.selectBudget(300000)">do €300.000</button>'
    );
  },

  selectBudget: function(budget) {
    InfinityAI.state.budget = budget;
    this.askDistrict();
  },

  askDistrict: function() {
    WidgetUI.setMessages(
      '<p><b>Koji deo Novog Sada vas interesuje?</b></p>' +
      '<button onclick="BuyFlow.selectDistrict(\'NOVI SAD CENTAR\')">Centar</button>' +
      '<button onclick="BuyFlow.selectDistrict(\'NOVI SAD LIMAN\')">Liman</button>' +
      '<button onclick="BuyFlow.selectDistrict(\'NOVI SAD TELEP\')">Telep</button>' +
      '<button onclick="BuyFlow.selectDistrict(\'NOVI SAD PODBARA\')">Podbara</button>' +
      '<button onclick="BuyFlow.selectDistrict(\'NOVI SAD DETELINARA\')">Detelinara</button>' +
      '<button onclick="BuyFlow.selectDistrict(\'\')">Nije presudno</button>'
    );
  },

  selectDistrict: function(district) {
    InfinityAI.state.district = district;
    this.askRooms();
  },

  askRooms: function() {
    WidgetUI.setMessages(
      '<p><b>Koliko soba vam je potrebno?</b></p>' +
      '<button onclick="BuyFlow.selectRooms(1)">1</button>' +
      '<button onclick="BuyFlow.selectRooms(2)">2</button>' +
      '<button onclick="BuyFlow.selectRooms(3)">3</button>' +
      '<button onclick="BuyFlow.selectRooms(4)">4+</button>'
    );
  },

  selectRooms: async function(rooms) {
    InfinityAI.state.rooms = rooms;

    WidgetUI.setMessages('<p>🔍 Tražim odgovarajuće objekte...</p>');

    try {
      const data = await PropertySearchService.search({
        budget: InfinityAI.state.budget,
        rooms: InfinityAI.state.rooms,
        district: InfinityAI.state.district
      });

      InfinityAI.state.propertiesCount = data.length;

      WidgetUI.setMessages(
        '<h3>✅ Pronašao sam ' + data.length + ' objekata.</h3>' +
        '<p>Šta vam je najvažnije pri izboru stana?</p>' +
        '<textarea id="preferences" placeholder="Na primer: lokacija, parking, sprat, blizina škole..." style="width:100%;height:90px;padding:10px;"></textarea><br><br>' +
        '<button class="infinity-ai-primary" onclick="BuyFlow.finish()">Nastavi</button>'
      );
    } catch (e) {
      console.error(e);
      WidgetUI.setMessages('<p>❌ Došlo je do greške pri pretrazi objekata.</p>');
    }
  },

  finish: function() {
    var preferencesInput = document.getElementById('preferences');

    var preferences =
      'Tip zahteva: Kupovina\n' +
      'Budžet: €' + InfinityAI.state.budget + '\n' +
      'Deo grada: ' + (InfinityAI.state.district || 'Nije presudno') + '\n' +
      'Broj soba: ' + InfinityAI.state.rooms + '\n' +
      'Najvažnije: ' + (preferencesInput ? preferencesInput.value : '');

    ContactFlow.show(preferences);
  }
};
