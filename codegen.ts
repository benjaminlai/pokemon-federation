import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    'subgraphs/pokemon/src/__generated__/types.ts': {
      schema: 'subgraphs/pokemon/src/schema.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        federation: true,
        contextType: '../subgraph.js#ContextValue',
        mappers: {
          Pokemon: '../subgraph.js#PokemonModel',
        },
      },
    },
    'subgraphs/cards/src/__generated__/types.ts': {
      schema: 'subgraphs/cards/src/schema.graphql',
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        federation: true,
        contextType: '../subgraph.js#ContextValue',
        mappers: {
          Pokemon: '../subgraph.js#PokemonRef',
          PokemonCard: '../subgraph.js#CardModel',
          Price: '../subgraph.js#PriceModel',
        },
      },
    },
  },
};

export default config;