const express = require("express");
const graphqlHTTP = require("express-graphql");
const router = express.Router();

let { buildSchema } = require("graphql");

/* Reading from:
   http://graphql.org/graphql-js/object-types/ */

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
	type Bid {
		bidding: Int
	}

	type Query {
		hello: String
		bid: Bid
	}
`);

class Bid {
	bidding() {
		return 10;
	}
}

// The root provides a resolver function for each API endpoint
let root  = {
  hello: () => {
    return "Hello, World!";
  },
  bid: function() {
	  return new Bid();
  }
};

// Running the API endpoint
router.use("/", graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

module.exports = router;
