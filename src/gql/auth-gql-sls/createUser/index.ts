import { createAdmin } from "./createUser.handler";

export const createUserResolver = {
  Mutation: {
    createAdmin,
  },
};

export * from "./createUser.schema";
