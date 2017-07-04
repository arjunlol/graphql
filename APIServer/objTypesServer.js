// way to define obj type is same way as define query type
// if wanted to make more methods based on random die
//we can make RandomDie obj type instead


// instead of root lvl resolver
// use class where resolvers are instance methods

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides the top-level API endpoints
var root = {
  getDie: function ({numSides}) {
    return new RandomDie(numSides || 6);
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8080);
console.log('Running a GraphQL API server at localhost:8080/graphql');


// When you issue a GraphQL query against
//an API that returns object types, you can
//call multiple methods on the object at once by
// nesting the GraphQL field names. For example,
//if you wanted to call both rollOnce to roll a die
//once, and roll to roll a die three times, you
//could do it with this query:

// {
//   getDie(numSides: 6) {
//     rollOnce
//     roll(numRolls: 3)
//   }
// }