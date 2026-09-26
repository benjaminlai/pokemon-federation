import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { parse } from 'graphql';
import { resolvers, typeDefs } from './subgraph.js';

async function start(): Promise<void> {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{
      typeDefs: parse(typeDefs),
      resolvers,
    }]),
  });

  const port = Number(process.env.CARDS_SUBGRAPH_PORT || 4002);
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({}),
  });

  console.log(`Cards subgraph ready at ${url}`);
}

start().catch((error) => {
  console.error('Failed to start Cards subgraph', error);
  process.exit(1);
});