const messenger = $json.messenger || '';
const contact = $json.contact || '';
const telegramUsername = $json.telegram_username || '';

const cleanPhone = contact
  .replace(/\+/g, '')
  .replace(/\s/g, '')
  .replace(/-/g, '')
  .replace(/\(/g, '')
  .replace(/\)/g, '');

let text =
  '🔥 Novi vruć lead\n\n' +
  '👤 Ime: ' + ($json.lead_name || '-') + '\n\n' +
  '📱 Messenger: ' + messenger + '\n' +
  'Kontakt: ' + contact + '\n';

if (messenger === 'Telegram') {
  text += 'Telegram username: ' + telegramUsername + '\n';
}

text +=
  '\n💶 Budžet: €' + ($json.budget || '-') + '\n' +
  '🏠 Broj soba: ' + ($json.rooms || '-') + '\n' +
  '🏡 Pronađeno objekata: ' + ($json.properties_count || '-') + '\n\n' +
  '⭐ Šta je klijentu najvažnije:\n' +
  ($json.preferences || '-');

let reply_markup = null;

if (messenger === 'WhatsApp' && cleanPhone) {
  reply_markup = {
    inline_keyboard: [
      [
        {
          text: '💬 Otvori WhatsApp',
          url: 'https://wa.me/' + cleanPhone
        }
      ]
    ]
  };
}

if (messenger === 'Telegram' && telegramUsername) {
  reply_markup = {
    inline_keyboard: [
      [
        {
          text: '💬 Otvori Telegram',
          url: 'https://t.me/' + telegramUsername.replace('@', '')
        }
      ]
    ]
  };
}

const payload = {
  chat_id: 7908758464,
  text: text
};

if (reply_markup) {
  payload.reply_markup = reply_markup;
}

return [
  {
    json: payload
  }
];
