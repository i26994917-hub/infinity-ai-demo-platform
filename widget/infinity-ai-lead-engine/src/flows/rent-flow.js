window.RentFlow = {
  start: function() {
    InfinityAI.state.budget = 0;
    InfinityAI.state.rooms = 0;
    InfinityAI.state.propertiesCount = 0;

    WidgetUI.setMessages(
      '<p><b>Unesite osnovne informacije za zakup:</b></p>' +
      '<input id="rentBudget" placeholder="Mesečni budžet, npr. 500 EUR" style="width:100%;padding:10px;"><br><br>' +
      '<input id="rentDistrict" placeholder="Koji deo grada vas interesuje?" style="width:100%;padding:10px;"><br><br>' +
      '<input id="rentRooms" placeholder="Koliko soba?" style="width:100%;padding:10px;"><br><br>' +
      '<textarea id="preferences" placeholder="Šta vam je najvažnije pri izboru nekretnine?" style="width:100%;height:90px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="RentFlow.finish()">Nastavi</button>'
    );
  },

  finish: function() {
    var preferences =
      'Tip zahteva: Zakup\n' +
      'Budžet za zakup: ' + document.getElementById('rentBudget').value + '\n' +
      'Deo grada: ' + document.getElementById('rentDistrict').value + '\n' +
      'Broj soba: ' + document.getElementById('rentRooms').value + '\n' +
      'Najvažnije: ' + document.getElementById('preferences').value;

    ContactFlow.show(preferences);
  }
};
