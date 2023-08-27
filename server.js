const express = require( 'express' );
const { buildSchema } = require( 'graphql' );
const { graphqlHTTP } = require( 'express-graphql' );

const schema = buildSchema(`
    type Query {
        hello: String
        otherField: Int
        rollDice(numDice: Int!, numSides: Int = 6): [Int]
        user(name: String = "Test"): User
        getDie(numSides: Int): RandomDie
    }

    type User {
        name: String
        age: Float
    }

    type RandomDie {
        numSides: Int
        rollOnce: Int
        roll(numRolls: Int!): [Int]
    }
`);

class RandomDie {
    constructor (numSides) {
        this.numSides = numSides;
    }

    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides)
    }

    roll({numRolls}) {
        var output = []
        for (let i = 0; i < numRolls; i++) {
            output.push(this.rollOnce())
        }
        return output
    }
}

class User {
    constructor (name) {
        this.name = name;
    }

    age() {
        return Math.floor(Math.random() * 100)
    }
}

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
    },
    user: (args) => new User(args.name),
    getDie: (args) => new RandomDie(args.numSides),
};

const app = express();

app.use( '/graphql', graphqlHTTP( {
    schema,
    rootValue,
    graphiql: true,
} ) );

app.listen( 4000 );
console.log( "Let's go!" );