import { loginWithPassword } from "./loginWithPassword";
import { forgotPassword } from "./forgotPassword";
import { resetPassword } from "./resetPassword";
// import { getMyData } from "./getMyData";
// import { initiatePhoneAuth, verifyPhoneAuth } from "./loginWithPhoneOTP";
// import { initiateEmailAuth, verifyEmailAuth } from "./loginWithEmailOTP";
import { merge } from "lodash";
import { createAdminResolver } from "../createUser";
import { echoResolver } from "../echo";
import { otpLoginResolver } from "../otpLogin";

// const x = {
//   Mutation: {
//     createAdmin,
//   },
// };

const y = {
  // Query: {
  //   me: getMyData,
  // },
  Mutation: {
    loginWithPassword,
    forgotPassword,
    resetPassword,
    // initiateEmailAuth,
    // verifyEmailAuth,
  },
};

export const resolvers = merge(
  createAdminResolver,
  echoResolver,
  otpLoginResolver,
  y
);
