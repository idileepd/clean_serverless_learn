import { forgotPassword, resetPassword } from "./recovery.handler";

export const recoveryResolver = {
  Mutation: {
    forgotPassword,
    resetPassword,
  },
};

export * from "./recovery.schema";
