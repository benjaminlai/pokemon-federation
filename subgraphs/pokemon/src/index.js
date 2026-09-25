const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { parse } = require('graphql');
const { typeDefs, resolvers } = require('./subgraph');

async function start() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{
      typeDefs: parse(typeDefs),
      resolvers,
    }]),
  });

  const port = Number(process.env.POKEMON_SUBGRAPH_PORT || 4001);
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async () => ({}),
  });

  console.log(`Pokemon subgraph ready at ${url}`);
}

start().catch((error) => {
  console.error('Failed to start Pokemon subgraph', error);
  process.exit(1);
});
