//make API server rather than script that runs single query
//express to run webserver, and use express-graphql library to mount graphQL API on /graphql endpt

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// make graphql schema
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// root provides resolver fnt for each api endpt
const root = {
  hello: () => {
    return 'Hello world!';
  },
};

//graphiql - we can use graphiql tool to manually issue graphql quuries
const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(8080);
console.log('Running a GraphQL API server at localhost:4000/graphql')