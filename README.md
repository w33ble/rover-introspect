# Apollo Rover Introspect Action

A GitHub Action to introspect a server and save the schema using the Apollo [Rover CLI](https://www.apollographql.com/docs/rover/).

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
| path   | graphql file path          |

## Usage
```
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
    - uses: danielsinclair/rover-introspect-action@v1
      with:
        federated: true
        subgraph: products
        server: http://localhost:3000/
      env:
        APOLLO_KEY: ${{ secrets.APOLLO_KEY }}
```