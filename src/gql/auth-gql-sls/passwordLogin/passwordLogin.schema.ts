import { gql } from "apollo-server-lambda";

export const passwordLoginTypeDef = gql`
  type Mutation {
    loginWithPassword(email: String!, password: String!): AuthPayload!
  }
`;
