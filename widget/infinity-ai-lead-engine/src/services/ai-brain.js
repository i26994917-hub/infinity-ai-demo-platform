window.AIBrainService = {
  url: 'https://infinity-47.app.n8n.cloud/webhook/ai-brain',

  send: async function(message, state) {
    return await Api.postJson(this.url, {
      apiKey: InfinityAI.apiKey,
      visitorId: InfinityAI.visitorId || '',
      sessionId: InfinityAI.sessionId || 'demo-session',
      message: message,
      state: state || {}
    });
  }
};