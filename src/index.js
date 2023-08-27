const fs = require('fs');
const path = require('path');
const { ApolloServer, PubSub } = require('apollo-server');
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
const pubsub = new PubSub()

const {getUserId} = require('./utils.js');

const Query = require('./resolvers/Query.js');
const Mutation = require('./resolvers/Mutation.js');
const User = require('./resolvers/User.js');
const Link = require('./resolvers/Link.js');
const Subscription = require('./resolvers/Subscription.js');

// 2
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
}

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => ({
    ...req,
    prisma,
    pubsub,
    userId:
      req && req.headers.authorization
        ? getUserId(req)
        : null
  })
})

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );