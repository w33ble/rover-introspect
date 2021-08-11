# Apollo Rover Introspect Action

A GitHub Action to introspect a server and save the schema using the Apollo [Rover CLI](https://www.apollographql.com/docs/rover/).

Depends upon service containers (published to a registry) to communicate with the Apollo service because of the lack of background job support in GitHub Actions.

## inputs
| name        | default | required               |
| :---------- | :------ | :--------------------- |
| federated   | false   | no                     |
| subgraph    |         | no, if federated false |
| server      |         | apollo server url      |

## outputs
| name   | description                |
| :----- | :------------------------- |
| schema | base64 encoded fetched SDL |

## Usage
```
jobs:
  introspect:
    runs-on: ubuntu-latest
    services:
      apollo:
        image: danielsinclair/apollo-example
    steps:
    - uses: danielsinclair/rover-introspect-action@v1
      with:
        federated: true
        subgraph: products
        server: http://apollo:3000/
      env:
        APOLLO_KEY: ${{ secrets.APOLLO_KEY }}
```

Introspected schema is saved to `products.graphql` artifact