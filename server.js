const express = require( 'express' );
const { buildSchema } = require( 'graphql' );
const { graphqlHTTP } = require( 'express-graphql' );

const schema = buildSchema(`
    type Query {
        hello: String
        otherField: Int
        rollDice(numDice: Int!, numSides: Int = 6): [Int]
    }
`);

// Resolver
const rootValue = {
    hello: 'Hello world!',
    otherField: 3,
    rollDice: ({numDice, numSides}) => {
        const output = [];

        for (let i = 0; i < numDice; i++) {
            output.push( 1 + Math.floor( Math.random() * numSides ) );
        }

        return output;
    }
};

const app = express();

app.use( '/graphql', graphqlHTTP( {
    schema,
    rootValue,
    graphiql: true,
} ) );

app.listen( 4000 );
console.log( "Let's go!" );