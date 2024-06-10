import { createAdmin } from "./createAdmin";
import { loginWithPassword } from "./loginWithPassword";
import { forgotPassword } from "./forgotPassword";
import { resetPassword } from "./resetPassword";
import { getMyData } from "./getMyData";
import { initiatePhoneAuth, verifyPhoneAuth } from "./loginWithPhoneOTP";

export const resolvers = {
  Query: {
    me: getMyData,
  },
  Mutation: {
    createAdmin,
    loginWithPassword,
    forgotPassword,
    resetPassword,
    initiatePhoneAuth,
    verifyPhoneAuth,
  },
};
