const express = require('express');
const graphqlHTTP = require('express-graphql');
const { schema } = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}));

app.listen(process.env.PORT || 4000);
