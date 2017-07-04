const {graphql, buildSchema} = require('graphql');

//make schema - graphql
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

//root provides resolver function for an api endpt
const root = {
  hello: () => {
    return 'Hello world!';
  },
};

//run the { hello } graphql query and print response
graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
})