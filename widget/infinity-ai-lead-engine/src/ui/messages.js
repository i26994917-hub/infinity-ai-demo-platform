window.Messages = {
  start: function() {
    return '' +
      '<p><b>Zdravo! Kako mogu da vam pomognem?</b></p>' +

      '<textarea id="aiFreeMessage" placeholder="Napišite šta tražite, na primer: Tražim trosoban stan do 170000 evra na Limanu..." style="width:100%;height:90px;padding:10px;"></textarea><br><br>' +

      '<button class="infinity-ai-primary" onclick="AIChatFlow.sendFirstMessage()">Pošalji pitanje</button>' +

      '<p class="ai-small-note">Ili izaberite jednu od opcija:</p>' +

      '<button onclick="InfinityAI.chooseType(\'buy\')">Želim da kupim stan/kuću</button>' +
      '<button onclick="InfinityAI.chooseType(\'sell\')">Želim da prodam stan/kuću</button>' +
      '<button onclick="InfinityAI.chooseType(\'rent\')">Želim da iznajmim stan/kuću</button>' +
      '<button onclick="InfinityAI.chooseType(\'let\')">Želim da izdam stan/kuću</button>' +
      '<button onclick="InfinityAI.chooseType(\'other\')">Imam drugo pitanje</button>';
  },

  thanks: function() {
    return '' +
      '<h3>✅ Hvala!</h3>' +
      '<p>Vaš zahtev je primljen.</p>' +
      '<p>Naš stručnjak će vam se uskoro javiti.</p>';
  },

  error: function() {
    return '<p>❌ Nije moguće poslati zahtev. Molimo pokušajte ponovo.</p>';
  }
};