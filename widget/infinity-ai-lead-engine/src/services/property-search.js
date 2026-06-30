window.PropertySearchService = {
  search: async function(params) {
    var body = {
      apiKey: InfinityAI.apiKey,
      maxPrice: params.budget,
      rooms: params.rooms
    };

    if (params.district) {
      body.district = params.district;
    }

    return await Api.postJson(Api.propertySearchUrl, body);
  }
};
