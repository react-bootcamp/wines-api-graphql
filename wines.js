const {
  graphql,
  buildSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require('graphql');
const fetch = require('node-fetch');

const rootUrl = 'https://wines-api.herokuapp.com/api';

function prettify(obj) {
  return JSON.stringify(obj, null, 2);
}

function getRegions(args = {}) {
  return fetch(`${rootUrl}/regions`)
    .then(r => r.json())
    .then(regions => regions.map(r => ({ id: r })))
    .then(regions => {
      if (args.first) {
        return regions.slice(0, args.first);
      } else if (args.last) {
        return regions.slice(regions.length - args.last, regions.length);
      } else if (args.ids) {
        return regions.fitler(r => args.ids.indexOf(r.id) > -1);
      } else {
        return regions;
      }
    });
}

function getWines(args = {}) {
  return getRegions().then(regions => Promise.all(regions.map(r => getWinesFromRegion(r)))).then(r => {
    return r.reduce((a, b) => a.concat(b), []);
  }).then(wines => {
    if (args.first) {
      return wines.slice(0, args.first);
    } else if (args.last) {
      return wines.slice(wines.length - args.last, wines.length);
    } else if (args.ids) {
      return wines.fitler(r => args.ids.indexOf(r.id) > -1);
    } else {
      return wines;
    }
  });
}

function getWinesFromRegion(region, args = {}) {
  return fetch(`${rootUrl}/wines?region=${region.id}`).then(r => r.json()).then(wines => {
    if (args.first) {
      return wines.slice(0, args.first);
    } else if (args.last) {
      return wines.slice(wines.length - args.last, wines.length);
    } else if (args.ids) {
      return wines.fitler(r => args.ids.indexOf(r.id) > -1);
    } else {
      return wines;
    }
  });
}

function getImage(wine) {
  return Promise.resolve({ url: `${rootUrl}/wines/${wine.id}/image` });
}

function getComments(wine, args = {}) {
  return fetch(`${rootUrl}/wines/${wine.id}/comments`).then(r => r.json()).then(comments => {
    if (args.first) {
      return comments.slice(0, args.first);
    } else if (args.last) {
      return comments.slice(comments.length - args.last, comments.length);
    } else {
      return comments;
    }
  });
}

function getLike(wine) {
  return fetch(`${rootUrl}/wines/${wine.id}/like`).then(r => r.json()).then(r => r.like);
}

function getRegion(id) {
  return Promise.resolve({ id });
}

function getWine(id) {
  return fetch(`${rootUrl}/wines/${id}`).then(r => r.json());
}

const RegionType = new GraphQLObjectType({
  name: 'Region',
  description: 'A region',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: 'The id of the region.' },
    wine: {
      type: WineType,
      description: 'One wine of the region',
      args: {
        id: { description: 'id to filter', type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (region, args) => {
        return getWine(args.id); // TODO: should also match region
      }
    },
    wines: {
      type: new GraphQLList(WineType),
      description: 'The wines of the region',
      args: {
        ids: { description: 'ids to filter', type: new GraphQLList(GraphQLString) },
        first: { description: 'First limit', type: GraphQLInt },
        last: { description: 'Last limit', type: GraphQLInt }
      },
      resolve: (region, args) => {
        return getWinesFromRegion(region, args);
      }
    }
  })
});

const AppelationType = new GraphQLObjectType({
  name: 'Appelation',
  description: 'A wine appelation',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString), description: 'The name of the appelation' },
    region: { type: new GraphQLNonNull(GraphQLString), description: 'The region of the appelation' }
  })
});

const ImageType = new GraphQLObjectType({
  name: 'Image',
  description: 'A wine image',
  fields: () => ({
    url: { type: new GraphQLNonNull(GraphQLString), description: 'The URL of the image' }
  })
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment',
  fields: () => ({
    date: { type: new GraphQLNonNull(GraphQLString), description: 'The date of the comment' },
    title: { type: new GraphQLNonNull(GraphQLString), description: 'The title of the comment' },
    content: { type: new GraphQLNonNull(GraphQLString), description: 'The content of the comment' }
  })
});

const WineType = new GraphQLObjectType({
  name: 'Wine',
  description: 'A wine',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: 'The id of the wine.' },
    name: { type: GraphQLString, description: 'The name of the wine.' },
    type: { type: GraphQLString, description: 'Type of the wine.' },
    image: { type: ImageType, description: 'Image of the wine.', resolve: (wine) => getImage(wine) },
    grapes: { type: new GraphQLList(GraphQLString), description: 'Grapes of the wine.' },
    appellation: { type: AppelationType, description: 'Appelation of the wine.', resolve: wine => wine.appellation },
    comments: {
      type: new GraphQLList(CommentType),
      description: 'Comments of the wine.',
      args: {
        first: { description: 'First limit', type: GraphQLInt },
        last: { description: 'Last limit', type: GraphQLInt }
      },
      resolve: (wine, args) => getComments(wine, args) },
    liked: { type: GraphQLBoolean, description: 'Liked of the wine.', resolve: wine => getLike(wine) },
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    regions: {
      type: new GraphQLList(RegionType),
      args: {
        ids: { description: 'ids to filter', type: new GraphQLList(GraphQLString) },
        first: { description: 'First limit', type: GraphQLInt },
        last: { description: 'Last limit', type: GraphQLInt }
      },
      resolve: (root, args) => {
        return getRegions(args)
      },
    },
    wines: {
      type: new GraphQLList(WineType),
      args: {
        ids: { description: 'ids to filter', type: new GraphQLList(GraphQLString) },
        first: { description: 'First limit', type: GraphQLInt },
        last: { description: 'Last limit', type: GraphQLInt }
      },
      resolve: (root, args) => {
        return getWines(args)
      },
    },
    region: {
      type: RegionType,
      args: {
        id: {
          description: 'id of the region',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => {
        return getRegion(id)
      },
    },
    wine: {
      type: WineType,
      args: {
        id: {
          description: 'id of the wine',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => {
        return getWine(id)
      },
    }
  })
});

const schema = new GraphQLSchema({
  query: QueryType,
  types: [ RegionType, WineType, new GraphQLList(WineType), new GraphQLList(RegionType) ]
});

exports.schema = schema;
