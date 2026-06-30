# Infinity AI Lead Engine — установка

## 1. Запуск локально

Открой папку проекта в VS Code и запусти `demo.html` через Live Server.

## 2. Установка на сайт агентства

На сайте агентства нужно подключить:

```html
<link rel="stylesheet" href="https://your-domain.com/widget.css">

<script src="https://your-domain.com/src/config/settings.js"></script>
<script src="https://your-domain.com/src/ui/widget-ui.js"></script>
<script src="https://your-domain.com/src/ui/messages.js"></script>
<script src="https://your-domain.com/src/ui/forms.js"></script>
<script src="https://your-domain.com/src/services/api.js"></script>
<script src="https://your-domain.com/src/services/property-search.js"></script>
<script src="https://your-domain.com/src/services/save-lead.js"></script>
<script src="https://your-domain.com/src/flows/contact-flow.js"></script>
<script src="https://your-domain.com/src/flows/buy-flow.js"></script>
<script src="https://your-domain.com/src/flows/sell-flow.js"></script>
<script src="https://your-domain.com/src/flows/rent-flow.js"></script>
<script src="https://your-domain.com/src/flows/let-flow.js"></script>
<script src="https://your-domain.com/src/flows/other-flow.js"></script>
<script src="https://your-domain.com/widget.js"></script>

<script>
InfinityAI.init({
  apiKey: 'AGENCY_API_KEY',
  autoOpenDelay: 3000
});
</script>
```

## 3. Supabase

Выполни SQL из:

```text
backend/supabase/migrations.sql
```

## 4. n8n

Workflow `save-lead`:

```text
Webhook
↓
Get Agency
↓
Merge
↓
Insert Lead
↓
Prepare Telegram Message
↓
Telegram Notification
↓
Respond to Webhook
```

Код для Code node находится в:

```text
backend/n8n/prepare-telegram-message.js
```
