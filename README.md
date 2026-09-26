# pokemon-federation

A minimal Apollo Federation learning setup with:

- **Pokemon subgraph** (PokeAPI-backed)
- **Cards subgraph** (Pokewallet-backed with `X-API-Key` auth)
- **Apollo Router** configured from a composed supergraph SDL

## Prerequisites

- Node.js 20+
- [Rover CLI](https://www.apollographql.com/docs/rover/getting-started)
- [Apollo Router](https://www.apollographql.com/docs/router/quickstart)

## Setup

```bash
cp .env.example .env
npm install
```

Set your API key from <https://api.pokewallet.io> in `.env`:

```bash
POKEWALLET_API_KEY="<your-key>"
```

Environment variables are loaded from `.env` automatically by [dotenvx](https://dotenvx.com) when starting the subgraphs (`npm run start:pokemon`, `npm run start:cards`, `npm run start:all`). Already-exported shell variables take precedence.

> Note: `imageUrl` points at `https://api.pokewallet.io/images/<id>`, which requires the `X-API-Key` header to fetch.

## Codegen

Resolver types are generated from the subgraph schemas with GraphQL Code Generator:

```bash
npm run codegen
```

This writes `subgraphs/{pokemon,cards}/src/__generated__/types.ts`. Run it whenever you change a `schema.graphql`. The generated files are committed so `npm run typecheck` and `npm test` work out of the box.

## Run subgraphs

```bash
npm run start:pokemon
npm run start:cards
```

## Run everything

`npm run start:all` composes the supergraph if needed and starts both subgraphs plus the Apollo Router together:

```bash
npm run start:all
```

The GraphQL endpoint is served at <http://localhost:4000/>. Requires the `rover` and `apollo-router` CLIs on your `PATH` (or `router/router` in this repo) per the prerequisites above.

## Compose supergraph

```bash
npm run compose:supergraph
```

This writes `supergraph/supergraph.graphql` using `supergraph/supergraph.yaml`.

## Run Apollo Router

```bash
npm run start:router
```

Router config is in `router/router.yaml`.

## Example query

```graphql
query Example {
  pokemon(name: "pikachu") {
    id
    name
    types
    cards(limit: 2) {
      id
      name
      setName
      rarity
      imageUrl
    }
  }
}
```
