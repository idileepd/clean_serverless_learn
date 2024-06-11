import { gql } from "apollo-server-lambda";

export const otpLoginSchema = gql`
  type InitiateEmailAuthResponse {
    sessionId: ID!
    otp: String!
  }

  type VerifyEmailAuthResponse {
    success: Boolean!
  }

  type InitiatePhoneAuthResponse {
    sessionId: ID!
    otp: String! # TODO: remove later
  }

  type VerifyPhoneAuthResponse {
    success: Boolean! #TODO add refresh access tokens, id tokens
  }

  type Mutation {
    initiateEmailAuth(email: String!): InitiateEmailAuthResponse!
    verifyEmailAuth(
      sessionId: ID!
      otp: String!
      email: String!
    ): VerifyEmailAuthResponse!
    initiatePhoneAuth(
      phoneNumber: PhoneNumber!
      phoneCountryCode: String!
    ): InitiatePhoneAuthResponse!
    verifyPhoneAuth(
      sessionId: ID!
      otp: String!
      phoneNumber: PhoneNumber!
    ): VerifyPhoneAuthResponse!
  }
`;
