# wines-api-graphql

The GraphQL version of the Wine api

available at [https://wines-api-graphql.herokuapp.com/graphql](https://wines-api-graphql.herokuapp.com/graphql)



## Try it

https://wines-api-graphql.herokuapp.com/graphql?query=query%20SomeWines%20%7B%0A%20%20regions(ids%3A%20%5B%22Bordeaux%22%2C%20%22Champagne%22%5D)%20%7B%20%0A%20%20%09wines(first%3A%201)%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20grapes%0A%20%20%20%20%20%20image%20%7B%0A%20%20%20%20%20%20%20%20url%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20appellation%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20comments(last%3A%202)%20%7B%0A%20%20%20%20%20%20%20%20content%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=SomeWines

```
curl -X POST -H 'Content-Type: application/graphql' 'https://wines-api-graphql.herokuapp.com/graphql' -d '
  query WinesQuery {
    wines(first: 3) {
      name
      appellation {
        name
        region
      }
    }
  }
'
```

## Query Schema

```graphql
{
  wine(id: String!) {
    id: String
    name: String
    type: String
    region: String
    grapes: [String]
    liked: Int
    image {
      url: String
    }
    appelation {
      name: String
      region: String
    }
    comments(first: Int?, last: Int?) {
      date: String
      title: String
      content: String
    }
  }
  region {
    id: String
    wine(id: String!) {
      # see /wine
    }
    wines(first: Int?, last: Int?, ids: [String]?) {
      # see /wine
    }
  }
  regions(first: Int?, last: Int?, ids: [String]?) {
    # see /region
  }
  wines(first: Int?, last: Int?, ids: [String]?, fromRegions: [String]?) {
    # see /wine
  }
}
```
