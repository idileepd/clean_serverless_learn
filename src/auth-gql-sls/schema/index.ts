import { createAdminSchema } from "../createUser";
import { echoSchema } from "../echo";
import { otpLoginSchema } from "../otpLogin";
import { allTypeDefs } from "./allTypeDefs";
import { CommonTypeDefs } from "./common";
// import { emailOTPLoginDefs } from "./emailOTPLogin";
// import { PhoneOtpLoginDefs } from "./phoneOTPLogin";

export const typeDefs = [
  createAdminSchema,
  echoSchema,
  otpLoginSchema,
  allTypeDefs,
  CommonTypeDefs,
  // PhoneOtpLoginDefs,
  // emailOTPLoginDefs,
];
