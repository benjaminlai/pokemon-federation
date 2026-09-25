const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const schemaPath = join(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf8');

const APITCG_BASE_URL = process.env.APITCG_BASE_URL || 'https://api.apitcg.com';

function getApiKey() {
  const value = process.env.APITCG_API_KEY;
  if (!value) {
    throw new Error('APITCG_API_KEY must be set');
  }
  return value;
}

async function fetchApiTcg(path) {
  const response = await fetch(`${APITCG_BASE_URL}${path}`, {
    headers: {
      'x-api-key': getApiKey(),
    },
  });

  if (!response.ok) {
    throw new Error(`APITCG request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function extractList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function toCardModel(card) {
  return {
    id: String(card.id),
    name: card.name || '',
    setName: card.set?.name ?? card.setName ?? null,
    rarity: card.rarity ?? null,
    imageUrl: card.images?.small ?? card.imageUrl ?? null,
  };
}

const resolvers = {
  Query: {
    cardById: async (_, { id }) => {
      const payload = await fetchApiTcg(`/v1/cards/${id}`);
      const card = payload?.data || payload;
      return card ? toCardModel(card) : null;
    },
    cardsByName: async (_, { name, page = 1, pageSize = 10 }) => {
      const payload = await fetchApiTcg(
        `/v1/cards?name=${encodeURIComponent(name)}&page=${page}&pageSize=${pageSize}`,
      );
      return extractList(payload).map(toCardModel);
    },
  },
  Pokemon: {
    cards: async (pokemon, { limit = 5 }) => {
      const payload = await fetchApiTcg(
        `/v1/cards?name=${encodeURIComponent(pokemon.name)}&page=1&pageSize=${limit}`,
      );
      return extractList(payload).map(toCardModel);
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
  toCardModel,
  extractList,
};
