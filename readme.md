# wines-api-graphql

The GraphQL version of the Wine api

available at `https://wines-api-graphql.herokuapp.com/graphql`

## Try it

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

## Schema

```graphql
{
  wine(id: String!) {
    id: String
    name: String
    type: String
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
  wines(first: Int?, last: Int?, ids: [String]?) {
    # see /wine
  }
}
```
