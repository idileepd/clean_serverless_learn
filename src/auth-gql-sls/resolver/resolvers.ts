import { createAdmin } from "./createAdmin";
import { loginWithPassword } from "./loginWithPassword";
import { forgotPassword } from "./forgotPassword";
import { resetPassword } from "./resetPassword";
import { getMyData } from "./getMyData";
import { initiatePhoneAuth, verifyPhoneAuth } from "./loginWithPhoneOTP";
import { initiateEmailAuth, verifyEmailAuth } from "./loginWithEmailOTP";
import { merge } from "lodash";

const x = {
  Mutation: {
    createAdmin,
  },
};

const y = {
  Query: {
    me: getMyData,
  },
  Mutation: {
    loginWithPassword,
    forgotPassword,
    resetPassword,
    initiatePhoneAuth,
    verifyPhoneAuth,
    initiateEmailAuth,
    verifyEmailAuth,
  },
};

export const resolvers = merge(x, y);
