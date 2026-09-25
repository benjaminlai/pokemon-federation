# pokemon-federation

A minimal Apollo Federation learning setup with:

- **Pokemon subgraph** (PokeAPI-backed)
- **Cards subgraph** (APITCG-backed with `x-api-key` auth)
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

Set your API key from <https://apitcg.com/platform/api-key>:

```bash
export APITCG_API_KEY="<your-key>"
```

## Run subgraphs

```bash
npm run start:pokemon
npm run start:cards
```

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
