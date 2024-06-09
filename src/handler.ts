import { ApolloServer } from "apollo-server-lambda";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const graphqlHandler = server.createHandler();
