import { gql } from "apollo-server-lambda";

export const echoTypeDef = gql`
  # TODO: add permissions required here if needed
  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    phoneCountryCode: String!
    userType: String!
    permissions: [String!]!
    active: Boolean!
  }

  type Query {
    me: User!
  }
`;
