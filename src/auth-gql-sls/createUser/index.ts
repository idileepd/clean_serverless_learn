import { createAdmin } from "./createUser.handler";

export const createAdminResolver = {
  Mutation: {
    createAdmin,
  },
};
export * from "./createUser.schema";
