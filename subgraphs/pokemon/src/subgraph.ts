import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Resolvers } from './__generated__/types.js';

const schemaPath = fileURLToPath(new URL('schema.graphql', import.meta.url));
export const typeDefs = readFileSync(schemaPath, 'utf8');

export interface ContextValue {}

export interface PokemonModel {
  id: string;
  name: string;
  height: number | null;
  weight: number | null;
  types: string[];
}

interface PokeApiTypeEntry {
  type?: { name?: string };
}

interface PokeApiPokemon {
  id: number;
  name: string;
  height?: number;
  weight?: number;
  types?: PokeApiTypeEntry[];
}

interface PokeApiPage {
  results?: { name: string }[];
}

const POKEAPI_BASE_URL = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

async function fetchPokeApi<T>(path: string): Promise<T> {
  const response = await fetch(`${POKEAPI_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`PokeAPI request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function toPokemonModel(pokemon: PokeApiPokemon): PokemonModel {
  return {
    id: String(pokemon.id),
    name: pokemon.name,
    height: pokemon.height ?? null,
    weight: pokemon.weight ?? null,
    types: Array.isArray(pokemon.types)
      ? pokemon.types.map((entry) => entry.type?.name).filter((type): type is string => Boolean(type))
      : [],
  };
}

export const resolvers: Resolvers = {
  Query: {
    pokemon: async (_, { id, name }) => {
      if (!id && !name) {
        throw new Error('Provide either id or name');
      }
      const pokemon = await fetchPokeApi<PokeApiPokemon>(`/pokemon/${id || name}`);
      return toPokemonModel(pokemon);
    },
    pokemons: async (_, { limit = 10, offset = 0 }) => {
      const page = await fetchPokeApi<PokeApiPage>(`/pokemon?limit=${limit}&offset=${offset}`);
      const pokemonList = await Promise.all(
        (page.results || []).map((entry) => fetchPokeApi<PokeApiPokemon>(`/pokemon/${entry.name}`)),
      );

      return pokemonList.map(toPokemonModel);
    },
  },
  Pokemon: {
    __resolveReference: async (reference) => {
      const pokemon = await fetchPokeApi<PokeApiPokemon>(`/pokemon/${reference.id}`);
      return toPokemonModel(pokemon);
    },
  },
};