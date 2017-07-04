
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language

// input types cant have fields that are other objs
// only basic scalar types , list types, and other input types
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

`);

// if message had complex fields theyd be put in this obj
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}


const fakeDatabase = {};
// The root provides the top-level API endpoints
const root = {
  getMessage: function({id}) {
    if (!fakeDatabase[id]) {
      throw new Error('no msg exists with id ' + id)
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: function({input}) {
    //create random id for database
    let id = require('crypto').randomBytes(10).toString('hex')

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: function ({id, input}) {
    if(!fakeDatabase[id]) {
      throw new Error('no msg exists with id ' + id);
    }
    //replaces all data
    fakeDatabase[id] = input;
    return new Message(id, input);
  }

}

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(8080);
console.log('Running a GraphQL API server at localhost:8080/graphql');


//js code that calls server
// var author = 'andy';
// var content = 'hope is a good thing';
// var xhr = new XMLHttpRequest();
// xhr.responseType = 'json';
// xhr.open("POST", "/graphql");
// xhr.setRequestHeader("Content-Type", "application/json");
// xhr.setRequestHeader("Accept", "application/json");
// xhr.onload = function () {
//   console.log('data returned:', xhr.response);
// }
// var query = `mutation CreateMessage($input: MessageInput) {
//   createMessage(input: $input) {
//     id
//   }
// }`;
// xhr.send(JSON.stringify({
//   query: query,
//   variables: {
//     input: {
//       author: author,
//       content: content,
//     }
//   }
// }));
