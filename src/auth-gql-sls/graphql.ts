import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-lambda";
import { connectToDatabase } from "../utils/db";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver/resolvers";
import { decodeToken } from "../utils/auth";
import User from "./models/User";

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
  context: async ({ event, context }) => {
    // TODO: Add sanitizer
    await connectToDatabase();

    // TODO:: x-api-key get it and store
    // Test token and throw Authentication Error if token invalid
    // const authHeader = event.headers.authorization || "";

    // TODO:: use this for user authentication
    // const token = authHeader.replace("Bearer ", "");
    // let currentUser = null;
    // console.log("authHeader: ", authHeader);

    // if (token) {
    //   try {
    //     const decoded = decodeToken(token);
    //     currentUser = await User.findById(decoded.id);
    //   } catch (err) {
    //     console.error("Error decoding token:", err);
    //   }
    // }

    // these gets added (context, user)
    // return { user: currentUser, token };
    return { event, context };
  },
  formatError,
});

export const handler = server.createHandler({
  expressGetMiddlewareOptions: {
    cors: {
      origin: "*",
      credentials: true,
    },
  },
});
