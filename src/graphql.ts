// handler.ts

import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-lambda";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { decodeToken } from "./utils/auth";
import User from "./models/User";
import { connectToDatabase } from "./initMongoDB"; // Ensure you have a function to connect to your database

const formatError = (err: any) => {
  if (err.originalError instanceof UserInputError) {
    return {
      message: err.message,
      code: "BAD_USER_INPUT",
      details: err.extensions.exception.errors,
    };
  }

  if (err.originalError instanceof AuthenticationError) {
    return {
      message: err.message,
      code: "UNAUTHENTICATED",
    };
  }

  // Default error formatting
  return {
    message: err.message,
    code: err.extensions.code || "INTERNAL_SERVER_ERROR",
  };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ event }) => {
    console.log("init DB");
    await connectToDatabase();
    console.log("DB Done !");

    const authHeader = event.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    let currentUser = null;
    console.log("authHeader: ", authHeader);

    if (token) {
      try {
        const decoded = decodeToken(token);
        currentUser = await User.findById(decoded.id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    // these gets added (context, user)
    return { user: currentUser, token };
  },
  formatError,
});

export const graphqlHandler = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: "*",
      credentials: true,
    },
  },
});
