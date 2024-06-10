import { gql } from "apollo-server-lambda";

export const createUserTypeDef = gql`
  input CreateAdminInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    phoneCountryCode: String!
    password: String!
    permissions: [String!]!
  }

  type GeneralResponse {
    success: Boolean
    error: String
    data: JSON
    message: String
  }

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

  type Mutation {
    createAdmin(input: CreateAdminInput!): GeneralResponse!
  }
`;
