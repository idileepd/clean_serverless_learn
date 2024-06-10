import { loginWithPassword } from "./passwordLogin.handler";

export const passwordLoginResolver = {
  Mutation: {
    loginWithPassword,
  },
};

export * from "./passwordLogin.schema";
