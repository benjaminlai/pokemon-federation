import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parse } from 'graphql';
import { buildSubgraphSchema } from '@apollo/subgraph';

import {
  resolvers as pokemonResolvers,
  typeDefs as pokemonTypeDefs,
} from '../subgraphs/pokemon/src/subgraph.js';
import {
  resolvers as cardsResolvers,
  typeDefs as cardsTypeDefs,
} from '../subgraphs/cards/src/subgraph.js';

test('pokemon subgraph schema builds', () => {
  const schema = buildSubgraphSchema([{
    typeDefs: parse(pokemonTypeDefs),
    resolvers: pokemonResolvers,
  }]);

  assert.ok(schema.getType('Pokemon'));
  assert.ok(schema.getQueryType()?.getFields().pokemon);
});

test('cards subgraph schema builds', () => {
  const schema = buildSubgraphSchema([{
    typeDefs: parse(cardsTypeDefs),
    resolvers: cardsResolvers,
  }]);

  assert.ok(schema.getType('PokemonCard'));
  assert.ok(schema.getQueryType()?.getFields().cardsByName);
});