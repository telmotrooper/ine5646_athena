const express = require("express");
const graphqlHTTP = require("express-graphql");
const router = express.Router();

let { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
let root  = {
  hello: () => {
    return "Hello, World!";
  },
};

// Running the API endpoint
router.use("/", graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

module.exports = router;
