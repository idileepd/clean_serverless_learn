import { ApolloServer } from "apollo-server-lambda";
import typeDefs from "./schema";
import resolvers from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // playground: true,
  introspection: true,
});

exports.handler = server.createHandler();
