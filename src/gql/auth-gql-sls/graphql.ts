import {
  ApolloServer,
  AuthenticationError,
  UserInputError,
} from "apollo-server-lambda";
import { connectToDatabase } from "../../utils/db";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import path from "path";
import fs from "fs";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { getSchema } from "./schema";

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

const initApolloServer = async () => {
  console.log("initializing apollo server");
  const schema = getSchema();
  console.log("done init apollo server", schema);

  try {
    const server = new ApolloServer({
      typeDefs: schema.typeDefs,
      resolvers: schema.resolvers,
      context: async ({ event, context }) => {
        // TODO: Add sanitizer
        await connectToDatabase();
        console.log("connected to db");

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
    return server;
  } catch (error) {
    console.log(error);
    console.log("unable to init server");
    throw new Error("unknown");
  }
};

export const handler = async () => {
  try {
    const server = await initApolloServer();
    return server.createHandler({
      expressGetMiddlewareOptions: {
        cors: {
          origin: "*",
          credentials: true,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return {
      msg: "erro",
    };
  }
};
