const express = require( 'express' );
const { buildSchema } = require( 'graphql' );
const { graphqlHTTP } = require( 'express-graphql' );
const crypto = require( 'crypto' );

const schema = buildSchema(`
    type Query {
        getMessage(id: ID!): Message
        getMessages: [Message]
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    input MessageInput {
        content: String
        author: String
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
    }
`);

class Message {
    constructor (id, {content, author}) {
        this.id = id;
        this.content = content
        this.author = author
    }
}

const fakeDatabase = {}

// Resolver
const rootValue = {
    getMessage: ({id}) => {
        if( !fakeDatabase[id] ) {
            throw new Error('no message existed with id: ' + id)
        }
        return new Message(id, fakeDatabase[id])
    },
    createMessage: ({input}) => {
        const id = crypto.randomBytes( 10 ).toString('hex')
        fakeDatabase[id] = input
        return new Message(id, input)
    },
    updateMessage: ({id, input}) => {
        if( !fakeDatabase[id] ) {
            throw new Error('no message existed with id: ' + id)
        }
        fakeDatabase[id] = input
        return new Message(id, input)
    },
    getMessages: () => {
        return Object.keys( fakeDatabase ).map( id => new Message( id, fakeDatabase[id] ))
    },
};

const app = express();

app.use( '/graphql', graphqlHTTP( {
    schema,
    rootValue,
    graphiql: true,
} ) );

app.listen( 4000 );
console.log( "Let's go!" );