import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Resolvers } from './__generated__/types.js';

const schemaPath = fileURLToPath(new URL('schema.graphql', import.meta.url));
export const typeDefs = readFileSync(schemaPath, 'utf8');

export interface ContextValue {}

export interface PokemonRef {
  id: string;
  name: string;
}

export interface PriceModel {
  low: number | null;
  mid: number | null;
  high: number | null;
  market: number | null;
}

export interface CardModel {
  id: string;
  name: string;
  setName: string | null;
  rarity: string | null;
  imageUrl: string | null;
  price: PriceModel | null;
}

interface TcgplayerPrice {
  low_price?: number | null;
  mid_price?: number | null;
  high_price?: number | null;
  market_price?: number | null;
}

interface CardmarketPrice {
  low?: number | null;
  avg?: number | null;
  avg7?: number | null;
  trend?: number | null;
}

interface PokewalletCard {
  id: string;
  card_info?: {
    name?: string;
    clean_name?: string;
    set_name?: string | null;
    rarity?: string | null;
  };
  tcgplayer?: { prices?: TcgplayerPrice[] } | null;
  cardmarket?: { prices?: CardmarketPrice[] } | null;
}

interface PokewalletSearchResponse {
  results?: PokewalletCard[];
  pagination?: { page: number; limit: number; total: number; total_pages: number };
}

const POKEWALLET_BASE_URL = process.env.POKEWALLET_BASE_URL || 'https://api.pokewallet.io';
const POKEWALLET_IMAGES_URL = 'https://api.pokewallet.io/images';

function getApiKey(): string {
  const value = process.env.POKEWALLET_API_KEY;
  if (!value) {
    throw new Error('POKEWALLET_API_KEY must be set');
  }
  return value;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 250;

async function fetchPokewallet<T>(path: string): Promise<T> {
  let lastError: Error = new Error('Pokewallet request failed');

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`${POKEWALLET_BASE_URL}${path}`, {
        headers: {
          'X-API-Key': getApiKey(),
        },
      });

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      lastError = new Error(`Pokewallet request failed: ${response.status} ${response.statusText}`);

      if (response.status < 500) {
        break;
      }
    } catch (error) {
      lastError = error as Error;
    }

    if (attempt < RETRY_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
    }
  }

  throw lastError;
}

function toPriceModel(
  tcgplayer?: PokewalletCard['tcgplayer'],
  cardmarket?: PokewalletCard['cardmarket'],
): PriceModel | null {
  const tcg = tcgplayer?.prices?.[0];
  if (tcg) {
    return {
      low: tcg.low_price ?? null,
      mid: tcg.mid_price ?? null,
      high: tcg.high_price ?? null,
      market: tcg.market_price ?? null,
    };
  }

  const cm = cardmarket?.prices?.[0];
  if (cm) {
    return {
      low: cm.low ?? null,
      mid: cm.avg7 ?? null,
      high: null,
      market: cm.avg ?? null,
    };
  }

  return null;
}

export function toCardModel(card: PokewalletCard): CardModel {
  const info = card.card_info ?? {};
  return {
    id: String(card.id),
    name: info.name || info.clean_name || '',
    setName: info.set_name ?? null,
    rarity: info.rarity ?? null,
    imageUrl: `${POKEWALLET_IMAGES_URL}/${card.id}`,
    price: toPriceModel(card.tcgplayer, card.cardmarket),
  };
}

export const resolvers: Resolvers = {
  Query: {
    cardsByName: async (_, { name, page = 1, pageSize = 10 }) => {
      const payload = await fetchPokewallet<PokewalletSearchResponse>(
        `/search?q=${encodeURIComponent(name)}&page=${page}&limit=${pageSize}`,
      );
      return (payload.results ?? []).map(toCardModel);
    },
  },
  Pokemon: {
    cards: async (pokemon, { limit = 5 }) => {
      const payload = await fetchPokewallet<PokewalletSearchResponse>(
        `/search?q=${encodeURIComponent(pokemon.name)}&page=1&limit=${limit}`,
      );
      return (payload.results ?? []).map(toCardModel);
    },
  },
};