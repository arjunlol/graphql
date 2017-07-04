//1. server that logs IP address of every request
//2. want to write an API that returns the IP address of the caller
//do 1 with middleware
//do 2 with accessing the request object in the resolver

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    ip: String
  }
`);

function loggingMiddleware(req, res, next) {
  console.log('ip:', req.ip);
  next();
}

var root = {
  ip: function (args, request) {
    return request.ip;
  }
};

var app = express();
app.use(loggingMiddleware);
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8080);
console.log('Running a GraphQL API server at localhost:8080/graphql');

// In a REST API, authentication is often
// handled with a header, that contains an auth
// token which proves what user is making this
 // request. Express middleware processes these
 // headers and puts authentication data on the
 // Express request object. Some middleware
 // modules that handle authentication like this
 // are Passport, express-jwt, and express-session.
 // Each of these modules works with express-graphql.