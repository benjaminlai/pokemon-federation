const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const schemaPath = join(__dirname, 'schema.graphql');
const typeDefs = readFileSync(schemaPath, 'utf8');

const POKEAPI_BASE_URL = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

async function fetchPokeApi(path) {
  const response = await fetch(`${POKEAPI_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function toPokemonModel(pokemon) {
  return {
    id: String(pokemon.id),
    name: pokemon.name,
    height: pokemon.height ?? null,
    weight: pokemon.weight ?? null,
    types: Array.isArray(pokemon.types) ? pokemon.types.map((entry) => entry.type?.name).filter(Boolean) : [],
  };
}

const resolvers = {
  Query: {
    pokemon: async (_, { id, name }) => {
      if (!id && !name) {
        throw new Error('Provide either id or name');
      }
      const pokemon = await fetchPokeApi(`/pokemon/${id || name}`);
      return toPokemonModel(pokemon);
    },
    pokemons: async (_, { limit = 10, offset = 0 }) => {
      const page = await fetchPokeApi(`/pokemon?limit=${limit}&offset=${offset}`);
      const pokemonList = await Promise.all(
        (page.results || []).map((entry) => fetchPokeApi(`/pokemon/${entry.name}`)),
      );

      return pokemonList.map(toPokemonModel);
    },
  },
  Pokemon: {
    __resolveReference: async (reference) => {
      const pokemon = await fetchPokeApi(`/pokemon/${reference.id}`);
      return toPokemonModel(pokemon);
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
  toPokemonModel,
};
