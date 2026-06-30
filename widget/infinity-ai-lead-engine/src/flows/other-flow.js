window.OtherFlow = {
  start: function() {
    InfinityAI.state.budget = 0;
    InfinityAI.state.rooms = 0;
    InfinityAI.state.propertiesCount = 0;

    WidgetUI.setMessages(
      '<p><b>Napišite svoje pitanje:</b></p>' +
      '<textarea id="otherQuestion" placeholder="Kako možemo da vam pomognemo?" style="width:100%;height:100px;padding:10px;"></textarea><br><br>' +
      '<button class="infinity-ai-primary" onclick="OtherFlow.finish()">Nastavi</button>'
    );
  },

  finish: function() {
    var preferences =
      'Tip zahteva: Drugo pitanje\n' +
      'Pitanje klijenta: ' + document.getElementById('otherQuestion').value;

    ContactFlow.show(preferences);
  }
};
