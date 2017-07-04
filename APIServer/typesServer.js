// graphQL schema supports String, Int, Float, Boolean, ID
// --> pass into buildSchema as arg
// every type nullable
// ! --> cannot be null
// list type surround type in square brackets
// [Int] -> list of integers


const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1,2,3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8080);
console.log('Running graphql api server at localhost:8080/graphql');