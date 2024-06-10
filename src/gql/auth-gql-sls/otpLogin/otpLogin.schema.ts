import { gql } from "apollo-server-lambda";

export const otpLoginTypeDef = gql`
  # TODO: Remove otp
  type InitiateEmailAuthResponse {
    sessionId: ID!
    otp: String!
  }

  # TODO: Response should be accessToken, idToken, refreshToken expiry
  type VerifyEmailAuthResponse {
    success: Boolean!
  }

  # TODO: remove otp later
  type InitiatePhoneAuthResponse {
    sessionId: ID!
    otp: String!
  }

  # TODO: add refresh access tokens, id tokens
  type VerifyPhoneAuthResponse {
    success: Boolean!
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
