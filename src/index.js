const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const {getUserId} = require('./utils.js');

const Query = require('./resolvers/Query.js');
const Mutation = require('./resolvers/Mutation.js');
const User = require('./resolvers/User.js');
const Link = require('./resolvers/Link.js');

// 2
const resolvers = {
  Query,
  Mutation,
  User,
  Link,
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