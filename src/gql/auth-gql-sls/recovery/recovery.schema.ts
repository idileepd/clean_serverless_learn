import { gql } from "apollo-server-lambda";

export const recoveryTypeDef = gql`
  type Message {
    message: String!
  }

  type Mutation {
    forgotPassword(email: String!): Message!
    resetPassword(token: String!, password: String!): AuthPayload!
  }
`;
