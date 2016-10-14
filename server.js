const express = require('express');
const graphqlHTTP = require('express-graphql');
const { schema } = require('./wines');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  pretty: true,
}));

app.listen(process.env.PORT || 4000);
