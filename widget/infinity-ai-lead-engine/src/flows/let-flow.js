window.LetFlow = {
  start: function() {
    WidgetUI.setMessages(
      '<p><b>Šta želite da izdate?</b></p>' +
      '<button onclick="LetFlow.step2(\'stan\')">Stan</button>' +
      '<button onclick="LetFlow.step2(\'kuća\')">Kuću</button>'
    );
  },

  step2: function(propertyType) {
    InfinityAI.state.propertyType = propertyType;
    InfinityAI.state.budget = 0;
    InfinityAI.state.rooms = 0;
    InfinityAI.state.propertiesCount = 0;

    WidgetUI.setMessages(
      '<p><b>Unesite osnovne informacije za izdavanje:</b></p>' +
      '<input id="letDistrict" placeholder="Deo grada" style="width:100%;padding:10px;"><br><br>' +
      '<input id="letArea" placeholder="Kvadratura" style="width:100%;padding:10px;"><br><br>' +
      '<input id="letPrice" placeholder="Željena mesečna kirija" style="width:100%;padding:10px;"><br><br>' +
      '<textarea id="preferences" placeholder="Dodatne informacije za agenta" style="width:100%;height:90px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="LetFlow.finish()">Nastavi</button>'
    );
  },

  finish: function() {
    var preferences =
      'Tip zahteva: Izdavanje\n' +
      'Tip nekretnine: ' + InfinityAI.state.propertyType + '\n' +
      'Deo grada: ' + document.getElementById('letDistrict').value + '\n' +
      'Kvadratura: ' + document.getElementById('letArea').value + '\n' +
      'Željena kirija: ' + document.getElementById('letPrice').value + '\n' +
      'Napomena: ' + document.getElementById('preferences').value;

    ContactFlow.show(preferences);
  }
};
