import { gql } from "apollo-server-lambda";

export const emailOTPLoginDefs = gql`
  type Mutation {
    initiateEmailAuth(email: String!): InitiateEmailAuthResponse!
    verifyEmailAuth(
      sessionId: ID!
      otp: String!
      email: String!
    ): VerifyEmailAuthResponse!
  }

  type InitiateEmailAuthResponse {
    sessionId: ID!
    otp: String!
  }

  type VerifyEmailAuthResponse {
    success: Boolean!
  }

  scalar ID
`;
