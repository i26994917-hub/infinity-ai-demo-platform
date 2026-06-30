window.SellFlow = {
  start: function() {
    WidgetUI.setMessages(
      '<p><b>Šta želite da prodate?</b></p>' +
      '<button onclick="SellFlow.step2(\'stan\')">Stan</button>' +
      '<button onclick="SellFlow.step2(\'kuća\')">Kuću</button>'
    );
  },

  step2: function(propertyType) {
    InfinityAI.state.propertyType = propertyType;
    InfinityAI.state.budget = 0;
    InfinityAI.state.rooms = 0;
    InfinityAI.state.propertiesCount = 0;

    WidgetUI.setMessages(
      '<p><b>Unesite osnovne informacije o nekretnini:</b></p>' +
      '<input id="sellDistrict" placeholder="Deo grada" style="width:100%;padding:10px;"><br><br>' +
      '<input id="sellArea" placeholder="Kvadratura, npr. 65 m²" style="width:100%;padding:10px;"><br><br>' +
      '<input id="sellPrice" placeholder="Očekivana cena" style="width:100%;padding:10px;"><br><br>' +
      '<textarea id="preferences" placeholder="Šta je važno da agent zna o nekretnini?" style="width:100%;height:90px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="SellFlow.finish()">Nastavi</button>'
    );
  },

  finish: function() {
    var preferences =
      'Tip zahteva: Prodaja\n' +
      'Tip nekretnine: ' + InfinityAI.state.propertyType + '\n' +
      'Deo grada: ' + document.getElementById('sellDistrict').value + '\n' +
      'Kvadratura: ' + document.getElementById('sellArea').value + '\n' +
      'Očekivana cena: ' + document.getElementById('sellPrice').value + '\n' +
      'Napomena: ' + document.getElementById('preferences').value;

    ContactFlow.show(preferences);
  }
};
