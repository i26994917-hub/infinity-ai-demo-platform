window.Messages = {
  start: function() {
    return '' +
      '<p><b>' + t('startTitle') + '</b></p>' +

      '<textarea id="aiFreeMessage" placeholder="' + t('textareaPlaceholder') + '" style="width:100%;height:90px;padding:10px;"></textarea><br><br>' +

      '<button class="infinity-ai-primary" onclick="AIChatFlow.sendFirstMessage()">' + t('sendQuestion') + '</button>' +

      '<p class="ai-small-note">' + t('chooseOption') + '</p>' +

      '<button onclick="InfinityAI.chooseType(\'buy\')">' + t('buy') + '</button>' +
      '<button onclick="InfinityAI.chooseType(\'sell\')">' + t('sell') + '</button>' +
      '<button onclick="InfinityAI.chooseType(\'rent\')">' + t('rent') + '</button>' +
      '<button onclick="InfinityAI.chooseType(\'let\')">' + t('let') + '</button>' +
      '<button onclick="InfinityAI.chooseType(\'other\')">' + t('other') + '</button>';
  },

  thanks: function() {
    return '' +
      '<h3>' + t('thanksTitle') + '</h3>' +
      '<p>' + t('thanksText1') + '</p>' +
      '<p>' + t('thanksText2') + '</p>';
  },

  error: function() {
    return '<p>' + t('error') + '</p>';
  }
};