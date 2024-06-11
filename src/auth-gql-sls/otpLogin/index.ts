import {
  initiateEmailAuth,
  initiatePhoneAuth,
  verifyEmailAuth,
  verifyPhoneAuth,
} from "./otpLogin.handler";

export const otpLoginResolver = {
  Mutation: {
    initiatePhoneAuth,
    verifyPhoneAuth,
    initiateEmailAuth,
    verifyEmailAuth,
  },
};

export * from "./otpLogin.schema";
