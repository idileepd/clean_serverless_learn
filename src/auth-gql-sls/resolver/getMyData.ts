import { AuthenticationError } from "apollo-server-lambda";

export const getMyData = async (_parent: any, _args: any, context: any) => {
  if (!context.user) {
    throw new AuthenticationError("You are not authenticated!");
  }
  return context.user;
};