import {
  initiateEmailAuth,
  initiatePhoneAuth,
  verifyEmailAuth,
  verifyPhoneAuth,
} from "./otpLogin.handler";

export const otpLoginResolver = {
  Mutation: {
    initiateEmailAuth,
    verifyEmailAuth,
    initiatePhoneAuth,
    verifyPhoneAuth,
  },
};

export * from "./otpLogin.schema";
