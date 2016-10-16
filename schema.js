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

const {
  getRegions,
  getWines,
  getWinesFromRegion,
  getImage,
  getComments,
  getLike,
  getRegion,
  getWine,
} = require('./wines');

const RegionType = new GraphQLObjectType({
  name: 'Region',
  description: 'A region where you can find wine',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString), description: 'The id of the region.' },
    wine: {
      type: WineType,
      description: 'One specific wine of the region',
      args: {
        id: { description: 'id of the wine to fetch', type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (region, args) => {
        return getWine(args.id); // TODO: should also match region
      }
    },
    wines: {
      type: new GraphQLList(WineType),
      description: 'The wines of the region',
      args: {
        ids: { description: 'Sequence of wine id to filter', type: new GraphQLList(GraphQLString) },
        first: { description: 'Filter the first n wines of the region', type: GraphQLInt },
        last: { description: 'Filter the last n wines of the region', type: GraphQLInt }
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
  description: 'A wine bottle image',
  fields: () => ({
    url: { type: new GraphQLNonNull(GraphQLString), description: 'The URL of the image' }
  })
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  description: 'A comment for a wine',
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
    type: { type: GraphQLString, description: 'The type of the wine.' },
    image: { type: ImageType, description: 'The image of the wine bottle.', resolve: (wine) => getImage(wine) },
    region: { type: GraphQLString, description: 'The parent region of the wine', resolve: wine => wine.appellation.region },
    appellation: { type: AppelationType, description: 'Appelation of the wine.', resolve: wine => wine.appellation },
    comments: {
      type: new GraphQLList(CommentType),
      description: 'Comments for the current wine.',
      args: {
        first: { description: 'Filter the first n comments of the wine', type: GraphQLInt },
        last: { description: 'Filter the last n comments of the wine', type: GraphQLInt }
      },
      resolve: (wine, args) => getComments(wine, args) },
    liked: { type: GraphQLBoolean, description: 'Whether the wine is liked or not.', resolve: wine => getLike(wine) },
  })
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Main query to fetch wines and/or regions and/or a unique wine and/or region',
  fields: () => ({
    regions: {
      type: new GraphQLList(RegionType),
      description: 'Fetch some regions that you can filter with first, last or sequence of ids',
      args: {
        ids: { description: 'Sequence of region id to filter', type: new GraphQLList(GraphQLString) },
        first: { description: 'Filter the first n regions', type: GraphQLInt },
        last: { description: 'Filter the last n regions', type: GraphQLInt }
      },
      resolve: (root, args) => {
        return getRegions(args)
      },
    },
    wines: {
      type: new GraphQLList(WineType),
      description: 'Fetch some wines that you can filter with first, last or sequence of ids',
      args: {
        fromRegions: { description: 'Sequence of region id to filter wines', type: new GraphQLList(GraphQLString) },
        ids: { description: 'Sequence of wine id to filter', type: new GraphQLList(GraphQLString) },
        first: { description: 'Filter the first n wines', type: GraphQLInt },
        last: { description: 'Filter the last n wines', type: GraphQLInt }
      },
      resolve: (root, args) => {
        return getWines(args)
      },
    },
    region: {
      type: RegionType,
      description: 'Fetch one specific region by id',
      args: {
        id: {
          description: 'id of the region to fetch',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => {
        return getRegion(id)
      },
    },
    wine: {
      type: WineType,
      description: 'Fetch one specific wine by id',
      args: {
        id: {
          description: 'id of the wine to fetch',
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (root, { id }) => {
        return getWine(id)
      },
    }
  })
});

exports.schema = new GraphQLSchema({
  query: QueryType,
  types: [ RegionType, WineType, new GraphQLList(WineType), new GraphQLList(RegionType) ]
});
