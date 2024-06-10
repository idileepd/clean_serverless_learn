// import { gql } from "apollo-server-lambda";

// export const PhoneOtpLoginDefs = gql`
//   type Mutation {
//     initiatePhoneAuth(phoneNumber: String!): InitiatePhoneAuthResponse!
//     verifyPhoneAuth(
//       sessionId: ID!
//       otp: String!
//       phoneNumber: String!
//     ): VerifyPhoneAuthResponse!
//   }

//   type InitiatePhoneAuthResponse {
//     sessionId: ID!
//   }

//   type VerifyPhoneAuthResponse {
//     success: Boolean!
//   }

//   scalar ID
// `;

import { gql } from "apollo-server-lambda";

export const PhoneOtpLoginDefs = gql`
  scalar PhoneNumber
  scalar ID

  type Mutation {
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

  type InitiatePhoneAuthResponse {
    sessionId: ID!
    otp: String! # TODO: remove later
  }

  type VerifyPhoneAuthResponse {
    success: Boolean! #TODO add refresh access tokens, id tokens
  }
`;
