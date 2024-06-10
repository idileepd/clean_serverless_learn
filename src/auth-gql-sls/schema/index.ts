import { allTypeDefs } from "./allTypeDefs";
import { CommonTypeDefs } from "./common";
import { emailOTPLoginDefs } from "./emailOTPLogin";
import { PhoneOtpLoginDefs } from "./phoneOTPLogin";

export const typeDefs = [
  allTypeDefs,
  CommonTypeDefs,
  PhoneOtpLoginDefs,
  emailOTPLoginDefs,
];
