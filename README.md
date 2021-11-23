# Apollo Rover Introspection Action

This is a hopefully temporary fork of DanielSinclair's [rover-introspect](https://github.com/DanielSinclair/rover-introspect).

A GitHub Action to introspect a server and save the schema using the Apollo [Rover CLI](https://www.apollographql.com/docs/rover/).

Depends upon service containers (published to a registry) to communicate with the Apollo service because of the lack of background job support in GitHub Actions.

Works in tandem with:
- [rover-fetch](https://github.com/DanielSinclair/rover-fetch)
- [rover-publish](https://github.com/DanielSinclair/rover-publish)

## inputs
| name        | default | required               |
| :---------- | :------ | :--------------------- |
| federated   | false   | no                     |
| subgraph    |         | no, if federated false |
| server      |         | apollo server url      |
| headers     |         | no, JSON if provided   |

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
    - uses: w33ble/rover-introspect
      with:
        federated: true
        subgraph: products
        server: http://apollo:3000/
        headers: {"token": "s3cr3t"}
      env:
        APOLLO_KEY: ${{ secrets.APOLLO_KEY }}
```

Introspected schema is saved to `products.graphql` artifact