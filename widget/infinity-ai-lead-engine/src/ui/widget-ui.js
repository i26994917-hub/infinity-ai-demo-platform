window.WidgetUI = {
  create: function() {
    var html =
      '<button class="infinity-ai-button">💬</button>' +
      '<div class="infinity-ai-window">' +
      '<div class="infinity-ai-header">AI konsultant za nekretnine</div>' +
      '<div class="infinity-ai-messages"></div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', html);
  },

  open: function() {
    document.querySelector('.infinity-ai-window').style.display = 'block';
  },

  close: function() {
    document.querySelector('.infinity-ai-window').style.display = 'none';
  },

  toggle: function() {
    var win = document.querySelector('.infinity-ai-window');

    if (win.style.display === 'block') {
      this.close();
    } else {
      this.open();
    }
  },

  setMessages: function(html) {
    document.querySelector('.infinity-ai-messages').innerHTML = html;
  }
};
