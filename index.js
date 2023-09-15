require('dotenv').config(); 

const { ApolloServer } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');


const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; 

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    // Use the appropriate landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: 'my-graph-id@my-graph-variant',
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});


mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err);
  });
