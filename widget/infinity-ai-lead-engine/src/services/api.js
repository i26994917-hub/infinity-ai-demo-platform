window.Api = {
  propertySearchUrl: 'https://infinity-47.app.n8n.cloud/webhook/property-search',
  saveLeadUrl: 'https://infinity-47.app.n8n.cloud/webhook/save-lead',

  postJson: async function(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    if (!text) {
      return {
        success: true
      };
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return {
        success: response.ok,
        raw: text
      };
    }
  }
};