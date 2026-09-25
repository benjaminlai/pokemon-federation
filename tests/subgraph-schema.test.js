const test = require('node:test');
const assert = require('node:assert/strict');
const { parse } = require('graphql');
const { buildSubgraphSchema } = require('@apollo/subgraph');

const pokemonSubgraph = require('../subgraphs/pokemon/src/subgraph');
const cardsSubgraph = require('../subgraphs/cards/src/subgraph');

test('pokemon subgraph schema builds', () => {
  const schema = buildSubgraphSchema([{
    typeDefs: parse(pokemonSubgraph.typeDefs),
    resolvers: pokemonSubgraph.resolvers,
  }]);

  assert.ok(schema.getType('Pokemon'));
  assert.ok(schema.getQueryType().getFields().pokemon);
});

test('cards subgraph schema builds', () => {
  const schema = buildSubgraphSchema([{
    typeDefs: parse(cardsSubgraph.typeDefs),
    resolvers: cardsSubgraph.resolvers,
  }]);

  assert.ok(schema.getType('PokemonCard'));
  assert.ok(schema.getQueryType().getFields().cardById);
});
