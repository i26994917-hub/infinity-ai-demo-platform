window.SaveLeadService = {
  save: async function(payload) {
    payload.apiKey = InfinityAI.apiKey;
    payload.visitorId = InfinityAI.visitorId || '';
    payload.sessionId = InfinityAI.sessionId || '';

    return await Api.postJson(Api.saveLeadUrl, payload);
  }
};
